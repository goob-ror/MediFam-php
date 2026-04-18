import manajemenPendaftarView from "./manajemenPendaftar";
import ManajemenPendaftarModel from "./manajemenPendaftar-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";
import DataTable from "datatables.net-dt";
import $ from "jquery";
import "select2";

export default class ManajemenPendaftarPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new ManajemenPendaftarModel();
    this.navbarPresenter = null;
    this.dataTable = null;
    this.registrants = [];
    this.safariEvents = [];
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
    await this.loadData();
    this.render();
    this.initDataTable();
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

  async loadData() {
    try {
      // Load registrants
      const registrantsResponse = await this.model.getRegistrants();
      if (registrantsResponse.success) {
        this.registrants = registrantsResponse.data.registrants || [];
      } else {
        throw new Error(registrantsResponse.message);
      }

      // Load safari events
      const eventsResponse = await this.model.getSafariEvents();
      if (eventsResponse.success) {
        this.safariEvents = eventsResponse.data.events || [];
      } else {
        throw new Error(eventsResponse.message);
      }
    } catch (error) {
      console.error("Load data error:", error);
      this.registrants = [];
      this.safariEvents = [];

      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message || "Terjadi kesalahan saat memuat data",
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  render() {
    this.container.innerHTML = manajemenPendaftarView(
      this.user,
      this.registrants,
      this.safariEvents
    );
  }

  initDataTable() {
    // Destroy existing DataTable if exists
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    // Initialize DataTable
    const table = this.container.querySelector("#registrantsTable");
    if (table) {
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
        order: [[6, "desc"]], // Sort by registration date descending
        columnDefs: [
          { orderable: false, targets: [8] }, // Disable sorting on action column
        ],
        dom: '<"datatable-top"l>rt<"datatable-bottom"ip>',
      });
    }

    // Initialize Select2 for kegiatan filter
    const filterKegiatan = $("#filterKegiatan");
    if (filterKegiatan.length) {
      filterKegiatan.select2({
        placeholder: "Semua Kegiatan",
        allowClear: true,
        width: "100%",
        language: {
          noResults: function() {
            return "Kegiatan tidak ditemukan";
          },
          searching: function() {
            return "Mencari...";
          }
        }
      });
    }
  }

  restoreFilters() {
    // Restore kegiatan filter
    const savedKegiatan = localStorage.getItem("filterKegiatan");
    if (savedKegiatan && this.dataTable) {
      const filterKegiatan = $("#filterKegiatan");
      if (filterKegiatan.length) {
        filterKegiatan.val(savedKegiatan).trigger("change");
      }
    }

    // Restore status filter
    const savedStatus = localStorage.getItem("filterStatus");
    if (savedStatus && this.dataTable) {
      const filterStatus = this.container.querySelector("#filterStatus");
      if (filterStatus) {
        filterStatus.value = savedStatus;
        const statusText = savedStatus === "1" ? "Hadir" : "Belum Hadir";
        this.dataTable.column(7).search(statusText).draw();
      }
    }

    this.updateStats();
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

    const searchPendaftarPasien = this.container.querySelector("#searchPendaftarPasien");
    if (searchPendaftarPasien) {
      searchPendaftarPasien.addEventListener("input", (e) => {
        const keyword = e.target.value;

        this.dataTable.search(keyword).draw();
      })
    }

    // Filter by kegiatan
    const filterKegiatan = $("#filterKegiatan");
    if (filterKegiatan.length) {
      filterKegiatan.on("change", (e) => {
        const selectedId = $(e.target).val();
        
        if (!selectedId) {
          this.dataTable.column(4).search("").draw();
          localStorage.removeItem("filterKegiatan");
        } else {
          const selectedEvent = this.safariEvents.find(event => event.id == selectedId);
          if (selectedEvent) {
            localStorage.setItem("filterKegiatan", selectedId);
            this.dataTable.column(4).search(selectedEvent.judul_kegiatan).draw();
          }
        }
        
        this.updateStats();
      });
    }

    // Filter by status
    const filterStatus = this.container.querySelector("#filterStatus");
    if (filterStatus) {
      filterStatus.addEventListener("change", (e) => {
        const value = e.target.value;
        if (value === "") {
          this.dataTable.column(7).search("").draw();
          localStorage.removeItem("filterStatus");
        } else {
          const statusText = value === "1" ? "Hadir" : "Belum Hadir";
          this.dataTable.column(7).search(statusText).draw();
          localStorage.setItem("filterStatus", value);
        }
        this.updateStats();
      });
    }

    // Apply filters from URL query params (e.g. #/manajemen-pendaftar?kegiatan=14)
    this._applyFiltersFromUrl();

    // Unmark attendance buttons
    const uncheckButtons = this.container.querySelectorAll(".btn-uncheck");
    uncheckButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const registrantId = e.currentTarget.dataset.id;
        await this.handleUnmarkAttendance(registrantId);
      });
    })

    // Delete buttons
    const deleteButtons = this.container.querySelectorAll(".btn-delete");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const registrantId = e.currentTarget.dataset.id;
        await this.handleDelete(registrantId);
      });
    });

    // Export button
    const exportBtn = this.container.querySelector("#btnExportData");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.handleExport();
      });
    }

    // Restore persisted filters after all listeners are attached
    this.restoreFilters();
  }

  _applyFiltersFromUrl() {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const kegiatanId = params.get("kegiatan");

    if (!kegiatanId) return;

    const filterKegiatan = $("#filterKegiatan");
    if (!filterKegiatan.length) return;

    // If the option already exists in the select (loaded from safariEvents), just set it
    const existingEvent = this.safariEvents.find((e) => String(e.id) === kegiatanId);
    if (existingEvent) {
      filterKegiatan.val(kegiatanId).trigger("change");
      localStorage.setItem("filterKegiatan", kegiatanId);
    }
  }

  updateStats() {
    const visibleRows = this.dataTable.rows({ search: "applied" }).data();
    const total = visibleRows.length;
    const hadir = visibleRows.filter((row) => row[7].includes("Hadir") && !row[7].includes("Belum")).length;
    const belumHadir = total - hadir;

    const totalEl = this.container.querySelector("#totalPendaftar");
    const hadirEl = this.container.querySelector("#totalHadir");
    const belumHadirEl = this.container.querySelector("#totalBelumHadir");

    if (totalEl) totalEl.textContent = total;
    if (hadirEl) hadirEl.textContent = hadir;
    if (belumHadirEl) belumHadirEl.textContent = belumHadir;
  }

  async handleMarkAttendance(registrantId) {
    const result = await Swal.fire({
      title: "Konfirmasi Kehadiran",
      text: "Tandai peserta ini sebagai hadir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#51CBFF",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Tandai Hadir",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await this.model.markAttendance(registrantId);
        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Kehadiran berhasil ditandai",
            confirmButtonColor: "#51CBFF",
          });
          await this.loadData();
          this.render();
          this.initDataTable();
          this.attachEventListeners();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Gagal menandai kehadiran",
          confirmButtonColor: "#51CBFF",
        });
      }
    }
  }

  async handleUnmarkAttendance(registrantId) {
    const result = await Swal.fire({
      title: "Konfirmasi Batal Hadir",
      text: "Batalkan kehadiran peserta ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#51CBFF",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await this.model.unmarkAttendance(registrantId);
        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Kehadiran berhasil dibatalkan",
            confirmButtonColor: "#51CBFF",
          });
          await this.loadData();
          this.render();
          this.initDataTable();
          this.attachEventListeners();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Gagal membatalkan kehadiran",
          confirmButtonColor: "#51CBFF",
        });
      }
    }
  }

  async handleDelete(registrantId) {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus pendaftar ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await this.model.deleteRegistrant(registrantId);
        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pendaftar berhasil dihapus",
            confirmButtonColor: "#51CBFF",
          });
          await this.loadData();
          this.render();
          this.initDataTable();
          this.attachEventListeners();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Gagal menghapus pendaftar",
          confirmButtonColor: "#51CBFF",
        });
      }
    }
  }

  handleExport() {
    // Simple CSV export
    const headers = ["No", "Nama", "NIK", "No HP", "Kegiatan", "Tanggal Kegiatan", "Tanggal Daftar", "Status"];
    const rows = this.registrants.map((reg, index) => [
      index + 1,
      reg.nama_lengkap,
      reg.nik,
      reg.no_hp || '-',
      reg.judul_kegiatan,
      this.formatDate(reg.tanggal_kegiatan),
      this.formatDateTime(reg.created_at),
      reg.hadir ? 'Hadir' : 'Belum Hadir'
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pendaftar_safari_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
