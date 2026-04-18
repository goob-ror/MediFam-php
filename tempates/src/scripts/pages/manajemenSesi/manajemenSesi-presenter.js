import manajemenSesiView from "./manajemenSesi";
import ManajemenSesiModel from "./manajemenSesi-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";
import DataTable from "datatables.net-dt";
import flatpickr from "flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import { createSesiFormHTML } from "./sesi-form-template";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class ManajemenSesiPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new ManajemenSesiModel();
    this.navbarPresenter = null;
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
    this.render();
    this.attachEventListeners();
    await this.initDataTable();
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

  render() {
    this.container.innerHTML = manajemenSesiView(this.user);
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

    // Tambah Sesi button
    const btnTambah = this.container.querySelector("#btnTambahSesi");
    if (btnTambah) {
      btnTambah.addEventListener("click", () => {
        this.handleTambahSesi();
      });
    }

    // Status filter
    const statusFilter = this.container.querySelector("#statusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        if (this.dataTable) {
          this.dataTable.ajax.reload();
        }
      });
    }
  }

  async initDataTable() {
    const table = this.container.querySelector("#sesiTable");
    if (!table) return;

    this.dataTable = new DataTable(table, {
      processing: true,
      serverSide: true,
      ajax: async (data, callback) => {
        try {
          const statusFilter = this.container.querySelector("#statusFilter");
          const params = {
            search: data.search.value,
            status: statusFilter ? statusFilter.value : "",
            page: Math.floor(data.start / data.length) + 1,
            limit: data.length,
            sortBy: data.columns[data.order[0].column].data,
            sortOrder: data.order[0].dir.toUpperCase(),
          };

          const response = await this.model.getSessions(params);

          callback({
            draw: data.draw,
            recordsTotal: response.data.pagination.totalRecords,
            recordsFiltered: response.data.pagination.totalRecords,
            data: response.data.sessions,
          });
        } catch (error) {
          console.error("DataTable error:", error);
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        }
      },
      columns: [
        {
          data: "judul_kegiatan",
          title: "JUDUL KEGIATAN",
        },
        {
          data: "tanggal_kegiatan",
          title: "TANGGAL",
          render: (data) => {
            const date = new Date(data);
            return date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          },
        },
        {
          data: null,
          title: "WAKTU",
          orderable: false,
          render: (data) => {
            const fmt = (t) => t ? t.substring(0, 5) : null;
            if (data.waktu_mulai && data.waktu_selesai) {
              return `${fmt(data.waktu_mulai)} - ${fmt(data.waktu_selesai)}`;
            } else if (data.waktu_mulai) {
              return fmt(data.waktu_mulai);
            }
            return "-";
          },
        },
        {
          data: "lokasi",
          title: "LOKASI",
        },
        {
          data: "kecamatan",
          title: "KECAMATAN",
          render: (data) => data || "-",
        },
        {
          data: null,
          title: "PESERTA",
          orderable: false,
          render: (data) => {
            return `${data.peserta_terdaftar || 0} / ${data.target_peserta || 0}`;
          },
        },
        {
          data: "status",
          title: "STATUS",
          render: (data) => {
            const statusConfig = {
              draft: {
                class: "badge-secondary",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>`,
                label: "Draft",
              },
              terjadwal: {
                class: "badge-primary",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>`,
                label: "Terjadwal",
              },
              berlangsung: {
                class: "badge-warning",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                </svg>`,
                label: "Berlangsung",
              },
              selesai: {
                class: "badge-success",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>`,
                label: "Selesai",
              },
              dibatalkan: {
                class: "badge-danger",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>`,
                label: "Dibatalkan",
              },
            };
            const config = statusConfig[data] || statusConfig.terjadwal;
            return `<span class="badge ${config.class}">${config.icon} ${config.label}</span>`;
          },
        },
        {
          data: null,
          title: "AKSI",
          orderable: false,
          render: (data) => {
            return `
              <div class="action-buttons">
                <button class="btn-action btn-edit" data-id="${data.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
                  Edit
                </button>
                <button class="btn-action btn-delete" data-id="${data.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  Hapus
                </button>
              </div>
            `;
          },
        },
      ],
      language: {
        processing: "Memproses...",
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        zeroRecords: "Tidak ada data sesi",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
        infoFiltered: "(difilter dari _MAX_ total data)",
        search: "Cari:",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
      },
      pageLength: 10,
      order: [[1, "desc"]],
      drawCallback: () => {
        // Reattach event listeners after table redraw
        this.attachTableEventListeners();
      },
    });
  }

  attachTableEventListeners() {
    // Edit buttons
    const editButtons = this.container.querySelectorAll(".btn-edit");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const sesiId = e.currentTarget.dataset.id;
        this.handleEditSesi(sesiId);
      });
    });

    // Delete buttons
    const deleteButtons = this.container.querySelectorAll(".btn-delete");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const sesiId = e.currentTarget.dataset.id;
        this.handleDeleteSesi(sesiId);
      });
    });
  }

  async handleTambahSesi() {
    const result = await Swal.fire({
      html: createSesiFormHTML(),
      width: "95%",
      maxWidth: "950px",
      showConfirmButton: false,
      showCancelButton: false,
      padding: 0,
      background: "transparent",
      backdrop: `rgba(0,0,0,0.4)`,
      customClass: {
        popup: "sesi-form-popup",
      },
      didOpen: () => {
        this.initializeFormControls();
      },
    });
  }

  initializeFormControls(sesi = null) {
    // Initialize Flatpickr for date
    flatpickr("#sesi-tanggal", {
      locale: Indonesian,
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d F Y",
      minDate: "today",
    });

    // Initialize Flatpickr for time
    flatpickr("#sesi-waktu-mulai", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
    });

    flatpickr("#sesi-waktu-selesai", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
    });

    // Status icon change handler
    const statusSelect = document.getElementById("sesi-status");
    const statusIconDisplay = document.getElementById("status-icon-display");
    
    if (statusSelect && statusIconDisplay) {
      statusSelect.addEventListener("change", (e) => {
        const status = e.target.value;
        // Remove all status classes
        statusIconDisplay.className = "status-icon-display";
        // Add new status class
        statusIconDisplay.classList.add(status);
        // Update icon
        statusIconDisplay.innerHTML = this.getStatusIcon(status);
      });
      
      // Set initial class
      statusIconDisplay.classList.add(statusSelect.value);
    }

    // Initialize map
    let map = null;
    let marker = null;
    const mapContainer = document.getElementById("map-container");
    const btnToggleMap = document.getElementById("btn-toggle-map");
    const koordinatInput = document.getElementById("sesi-koordinat");
    const koordinatDisplay = document.getElementById("koordinat-display");
    const koordinatText = document.getElementById("koordinat-text");
    const btnClearKoordinat = document.getElementById("btn-clear-koordinat");

    // Load existing coordinates if editing
    if (sesi && sesi.lokasi_koordinat) {
      const [lat, lng] = sesi.lokasi_koordinat.split(",").map(Number);
      if (lat && lng) {
        koordinatInput.value = sesi.lokasi_koordinat;
        koordinatText.textContent = sesi.lokasi_koordinat;
        koordinatDisplay.style.display = "flex";
      }
    }

    btnToggleMap.addEventListener("click", () => {
      if (mapContainer.style.display === "none") {
        mapContainer.style.display = "block";
        btnToggleMap.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
          Sembunyikan Peta
        `;

        // Initialize map if not already initialized
        if (!map) {
          // Default to Samarinda, Indonesia
          const defaultLat = sesi && sesi.lokasi_koordinat ? parseFloat(sesi.lokasi_koordinat.split(",")[0]) : -0.5022;
          const defaultLng = sesi && sesi.lokasi_koordinat ? parseFloat(sesi.lokasi_koordinat.split(",")[1]) : 117.1536;

          map = L.map("map").setView([defaultLat, defaultLng], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(map);

          // Add existing marker if editing
          if (sesi && sesi.lokasi_koordinat) {
            marker = L.marker([defaultLat, defaultLng]).addTo(map);
            marker.bindPopup("<b>Lokasi Kegiatan</b>").openPopup();
          }

          // Click event to add marker
          map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            // Remove existing marker
            if (marker) {
              map.removeLayer(marker);
            }

            // Add new marker
            marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup("<b>Lokasi Kegiatan</b>").openPopup();

            // Update coordinates
            const koordinat = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            koordinatInput.value = koordinat;
            koordinatText.textContent = koordinat;
            koordinatDisplay.style.display = "flex";
          });

          // Fix map rendering issue
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }
      } else {
        mapContainer.style.display = "none";
        btnToggleMap.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
          </svg>
          Pilih Lokasi di Peta
        `;
      }
    });

    // Clear coordinates
    btnClearKoordinat.addEventListener("click", () => {
      koordinatInput.value = "";
      koordinatText.textContent = "";
      koordinatDisplay.style.display = "none";
      if (marker && map) {
        map.removeLayer(marker);
        marker = null;
      }
    });

    // Cancel button
    document.getElementById("btn-cancel").addEventListener("click", () => {
      Swal.close();
    });

    // Submit button
    document.getElementById("btn-submit").addEventListener("click", async () => {
      const judul = document.getElementById("sesi-judul").value.trim();
      const tanggal = document.getElementById("sesi-tanggal").value;
      const waktuMulai = document.getElementById("sesi-waktu-mulai").value;
      const waktuSelesai = document.getElementById("sesi-waktu-selesai").value;
      const lokasi = document.getElementById("sesi-lokasi").value.trim();
      const kecamatan = document.getElementById("sesi-kecamatan").value;
      const target = document.getElementById("sesi-target").value;
      const status = document.getElementById("sesi-status").value;
      const koordinat = koordinatInput.value;

      if (!judul || !tanggal || !lokasi) {
        Swal.showValidationMessage("Judul kegiatan, tanggal, dan lokasi harus diisi");
        return;
      }

      try {
        const formData = {
          judul_kegiatan: judul,
          tanggal_kegiatan: tanggal,
          waktu_mulai: waktuMulai || null,
          waktu_selesai: waktuSelesai || null,
          lokasi,
          lokasi_koordinat: koordinat || null,
          kecamatan: kecamatan || null,
          target_peserta: target ? parseInt(target) : 0,
          status,
        };

        if (sesi) {
          // Update existing session
          await this.model.updateSession(sesi.id, formData);
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Sesi berhasil diupdate",
            confirmButtonColor: "#51CBFF",
          });
        } else {
          // Create new session
          await this.model.createSession(formData);
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Sesi berhasil ditambahkan",
            confirmButtonColor: "#51CBFF",
          });
        }

        this.dataTable.ajax.reload();
      } catch (error) {
        Swal.showValidationMessage(error.message || "Gagal menyimpan sesi");
      }
    });
  }

  async handleEditSesi(sesiId) {
    try {
      // Get session detail
      const response = await this.model.getSessionDetail(sesiId);
      const sesi = response.data.session;

      const result = await Swal.fire({
        html: createSesiFormHTML(sesi, true),
        width: "95%",
        maxWidth: "950px",
        showConfirmButton: false,
        showCancelButton: false,
        padding: 0,
        background: "transparent",
        backdrop: `rgba(0,0,0,0.4)`,
        customClass: {
          popup: "sesi-form-popup",
        },
        didOpen: () => {
          this.initializeFormControls(sesi);
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal memuat data sesi",
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  async handleDeleteSesi(sesiId) {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus sesi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await this.model.deleteSession(sesiId);
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Sesi berhasil dihapus",
          confirmButtonColor: "#51CBFF",
        });
        this.dataTable.ajax.reload();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Gagal menghapus sesi",
          confirmButtonColor: "#51CBFF",
        });
      }
    }
  }

  getStatusIcon(status) {
    const icons = {
      draft: `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
        </svg>
      `,
      terjadwal: `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>
        </svg>
      `,
      berlangsung: `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
          <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
          <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
      `,
      selesai: `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      `,
      dibatalkan: `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
      `,
    };
    return icons[status] || icons.terjadwal;
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
