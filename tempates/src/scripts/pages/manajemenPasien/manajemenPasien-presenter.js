import manajemenPasienView from "./manajemenPasien";
import ManajemenPasienModel from "./manajemenPasien-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";
import DataTable from "datatables.net-dt";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";

export default class ManajemenPasienPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new ManajemenPasienModel();
    this.navbarPresenter = null;
    this.searchTerm = "";
    this.sortOrder = "DESC";
    this.pasienData = [];
    this.pagination = {};
    this.dataTable = null;
  }

  async init() {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.hash = "#/login";
      return;
    }

    // Verify token with backend
    const authCheck = await authService.checkAuth();
    if (!authCheck.success) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      authService.logout();
      return;
    }

    // Check user role
    const user = authService.getUser();
    if (user && user.role !== "bidan") {
      window.location.hash = "#/dashboard-bidan";
      return;
    }

    await this.loadUserData();
    await this.loadPasienData();
    this.render();
    this.attachEventListeners();
  }

  async loadUserData() {
    try {
      const userData = authService.getUser();
      const createdDate = new Date(userData.created_at || Date.now());

      this.user = {
        id: userData.id,
        name: userData.nama_lengkap || userData.username || "Bidan",
        username: userData.username,
        avatar: "/public/image/userAvatar-Female.png",
        joinDate: createdDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        role: userData.role,
      };
    } catch (error) {
      console.error("Load user data error:", error);
      this.user = {
        name: "Bidan",
        avatar: "/public/image/userAvatar-Female.png",
        joinDate: "01 Desember 2025",
        role: "bidan",
      };
    }
  }

  async loadPasienData() {
    try {
      const params = {
        search: this.searchTerm,
        sortBy: "tanggal_jadwal_kembali",
        sortOrder: this.sortOrder,
      };

      const response = await this.model.getPatients(params);

      if (response.success) {
        this.pasienData = response.data.patients;
        this.pagination = response.data.pagination;
      } else {
        throw new Error(response.message || "Gagal memuat data");
      }
    } catch (error) {
      console.error("Load pasien data error:", error);
      this.pasienData = [];
      this.pagination = {
        totalRecords: 0,
      };

      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data pasien",
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  render() {
    this.container.innerHTML = manajemenPasienView(
      this.user,
      this.pasienData,
      this.pagination,
      this.sortOrder
    );
    
    // Initialize DataTable after render
    this.initDataTable();
  }

  initDataTable() {
    // Destroy existing DataTable if exists
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    const table = this.container.querySelector(".pasien-table");
    if (table && this.pasienData.length > 0) {
      this.dataTable = new DataTable(table, {
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        language: {
          lengthMenu: "Tampilkan _MENU_ data per halaman",
          zeroRecords: "Data tidak ditemukan",
          info: "Menampilkan halaman _PAGE_ dari _PAGES_",
          infoEmpty: "Tidak ada data tersedia",
          infoFiltered: "(difilter dari _MAX_ total data)",
          search: "Cari:",
          paginate: {
            first: "Pertama",
            last: "Terakhir",
            next: "Selanjutnya",
            previous: "Sebelumnya",
          },
        },
        order: [[1, "asc"]], // Sort by name
        columnDefs: [
          { orderable: false, targets: [5] }, // Disable sorting on action column
        ],
        dom: '<"datatable-top"l>rt<"datatable-bottom"ip>',
      });

      // Connect custom search input to DataTables search
      const searchInput = this.container.querySelector("#searchPasien");
      if (searchInput) {
        // Clear the value on init to avoid confusion
        searchInput.value = "";
        
        // Add event listener for real-time search
        searchInput.addEventListener("keyup", (e) => {
          this.dataTable.search(e.target.value).draw();
        });
      }
    }
  }

  attachEventListeners() {
    // Initialize navbar presenter
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();

    // Logout button
    const logoutBtn = this.container.querySelector(".nav-item.logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }

    // Note: Search is now handled in initDataTable() method

    // Sort button - now uses DataTables sorting
    const btnSort = this.container.querySelector("#btnSortTanggal");
    if (btnSort) {
      btnSort.addEventListener("click", () => {
        if (this.dataTable) {
          // Toggle sort order on column 3 (Akseptor/tanggal_jadwal_kembali)
          const currentOrder = this.dataTable.order();
          const newOrder = currentOrder[0] && currentOrder[0][1] === 'asc' ? 'desc' : 'asc';
          this.dataTable.order([4, newOrder]).draw();
          
          // Update button icon
          this.sortOrder = newOrder.toUpperCase();
          this.updateSortIcon();
        }
      });
    }

    // Tambah Pasien button
    const btnTambah = this.container.querySelector("#btnTambahPasien");
    if (btnTambah) {
      btnTambah.addEventListener("click", () => {
        this.handleTambahPasien();
      });
    }
  }

  updateSortIcon() {
    const btnSort = this.container.querySelector("#btnSortTanggal");
    if (btnSort) {
      const sortIcon = this.sortOrder === "ASC"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
          </svg>`;
      
      btnSort.innerHTML = `${sortIcon} Sortir Berdasarkan Tanggal Rujukan Kembali`;
    }
  }

  async handleTambahPasien() {
    const { value: formValues } = await Swal.fire({
      title: "Tambah Pasien Baru",
      html: `
        <div style="text-align: left; max-height: 500px; overflow-y: auto; padding: 0 1rem;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">NIK <span style="color: red;">*</span></label>
            <input type="text" id="pasien-nik" class="swal2-input" placeholder="16 digit NIK" maxlength="16" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nama Lengkap <span style="color: red;">*</span></label>
            <input type="text" id="pasien-nama" class="swal2-input" placeholder="Nama lengkap pasien" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Jenis Kelamin <span style="color: red;">*</span></label>
            <select id="pasien-gender" class="swal2-input" style="width: 100%; margin: 0;">
              <option value="">Pilih Jenis Kelamin</option>
              <option value="P">Perempuan</option>
              <option value="L">Laki-laki</option>
            </select>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tempat Lahir</label>
            <input type="text" id="pasien-tempat-lahir" class="swal2-input" placeholder="Tempat lahir" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tanggal Lahir <span style="color: red;">*</span></label>
            <input type="text" id="pasien-tanggal-lahir" class="swal2-input flatpickr-input" placeholder="Pilih tanggal" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">No. HP <span style="color: red;">*</span></label>
            <input type="tel" id="pasien-hp" class="swal2-input" placeholder="08xxxxxxxxxx" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Alamat</label>
            <textarea id="pasien-alamat" class="swal2-textarea" placeholder="Alamat lengkap" style="width: 100%; margin: 0; min-height: 80px;"></textarea>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Kecamatan</label>
            <input type="text" id="pasien-kecamatan" class="swal2-input" placeholder="Kecamatan" style="width: 100%; margin: 0;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">No. KK</label>
            <input type="text" id="pasien-kk" class="swal2-input" placeholder="16 digit No. KK" maxlength="16" style="width: 100%; margin: 0;">
          </div>
        </div>
      `,
      width: "600px",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#51CBFF",
      didOpen: () => {
        // Initialize flatpickr for date input
        flatpickr("#pasien-tanggal-lahir", {
          dateFormat: "Y-m-d",
          maxDate: "today",
          locale: Indonesian,
        });
      },
      preConfirm: () => {
        const nik = document.getElementById("pasien-nik").value;
        const nama = document.getElementById("pasien-nama").value;
        const gender = document.getElementById("pasien-gender").value;
        const tempatLahir = document.getElementById("pasien-tempat-lahir").value;
        const tanggalLahir = document.getElementById("pasien-tanggal-lahir").value;
        const hp = document.getElementById("pasien-hp").value;
        const alamat = document.getElementById("pasien-alamat").value;
        const kecamatan = document.getElementById("pasien-kecamatan").value;
        const kk = document.getElementById("pasien-kk").value;

        // Validation
        if (!nik || !nama || !gender || !tanggalLahir || !hp) {
          Swal.showValidationMessage("Field yang bertanda * wajib diisi");
          return false;
        }

        if (nik.length !== 16) {
          Swal.showValidationMessage("NIK harus 16 digit");
          return false;
        }

        if (!/^08\d{8,11}$/.test(hp)) {
          Swal.showValidationMessage("Format No. HP tidak valid (08xxxxxxxxxx)");
          return false;
        }

        return {
          nik,
          nama_lengkap: nama,
          jenis_kelamin: gender,
          tempat_lahir: tempatLahir,
          tanggal_lahir: tanggalLahir,
          no_hp: hp,
          alamat,
          kecamatan,
          no_kk: kk,
        };
      },
    });

    if (formValues) {
      try {
        const response = await this.model.createPatient(formValues);
        
        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pasien berhasil ditambahkan",
            confirmButtonColor: "#51CBFF",
          });
          
          // Reload data
          await this.loadPasienData();
          this.render();
          this.attachEventListeners();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Gagal menambahkan pasien",
          confirmButtonColor: "#51CBFF",
        });
      }
    }
  }

  async handleLogout() {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      authService.logout();
    }
  }
}
