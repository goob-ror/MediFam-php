import dashboardBidanView from "./dashboardBidan";
import DashboardBidanModel from "./dashboardBidan-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class DashboardBidanPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new DashboardBidanModel();
    this.navbarPresenter = null;
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
      window.location.hash = "#/dashboard-user";
      return;
    }

    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      // Load user data from authService (same as other pages)
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

      // Load today's sessions
      this.todaySessions = await this.model.getTodaySessions();

      // Load pasien mendaftar count (this year)
      this.pasienMendaftar = await this.model.getPasienMendaftar();

      // Load rujukan kembali stats
      this.rujukanKembali = await this.model.getRujukanKembali();

      // Load pengingat pasien berkala
      this.pengingatPasien = await this.model.getPengingatPasien();

      // Load upcoming sessions
      this.upcomingSessions = await this.model.getUpcomingSessions();
    } catch (error) {
      console.error("Load data error:", error);

      // Fallback data
      const storedUser = authService.getUser();
      const createdDate = new Date(storedUser?.created_at || Date.now());
      
      this.user = {
        name: storedUser?.nama_lengkap || storedUser?.name || "Bidan",
        avatar: "/public/image/userAvatar-Female.png",
        joinDate: createdDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        role: "bidan",
      };

      // Mock data for demonstration
      this.todaySessions = [];
      this.pasienMendaftar = 0;
      this.rujukanKembali = { total: 0, earliest: null, latest: null };
      this.pengingatPasien = [];
      this.upcomingSessions = [];
    }
  }

  render() {
    this.container.innerHTML = dashboardBidanView(
      this.user,
      this.todaySessions,
      this.rujukanKembali,
      this.pengingatPasien,
      this.pasienMendaftar,
      this.upcomingSessions
    );
  }

  attachEventListeners() {
    // Initialize navbar presenter for dropdown and logout
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();

    // Logout button
    const logoutBtn = this.container.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }

    // Add session button
    const addSessionBtn = this.container.querySelector("#addSessionBtn");
    if (addSessionBtn) {
      addSessionBtn.addEventListener("click", () => {
        window.location.hash = "#/manajemen-sesi";
      });
    }

    // Pengingat pasien pagination
    this._initPengingatPagination();
  }

  _initPengingatPagination() {
    const PAGE_SIZE = 4;
    const allItems = Array.from(this.container.querySelectorAll(".pengingat-item"));
    const savedHideSelesaiCheck = localStorage.getItem("sembunyikanSelesai");
    if (!allItems.length) return;
    
    if (savedHideSelesaiCheck === "true") {
      const toggle = this.container.querySelector("#sembunyikanSelesai");
      if (toggle) toggle.checked = true;
    }

    let hideSelesai = true;
    let currentPage = 0;

    const prevBtn = this.container.querySelector("#pengingatPrev");
    const nextBtn = this.container.querySelector("#pengingatNext");
    const pageInfo = this.container.querySelector("#pengingatPageInfo");
    const toggle = this.container.querySelector("#sembunyikanSelesai");

    const getVisible = () => hideSelesai
      ? allItems.filter(el => !el.querySelector(".status-selesai"))
      : allItems;

    const render = () => {
      const visible = getVisible();
      const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
      if (currentPage >= totalPages) currentPage = totalPages - 1;

      allItems.forEach(el => el.style.display = "none");
      visible.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
        .forEach(el => el.style.display = "");

      if (pageInfo) pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
    };

    render();

    prevBtn?.addEventListener("click", () => { if (currentPage > 0) { currentPage--; render(); } });
    nextBtn?.addEventListener("click", () => { const t = Math.ceil(getVisible().length / PAGE_SIZE); if (currentPage < t - 1) { currentPage++; render(); } });
    toggle?.addEventListener("change", () => { hideSelesai = toggle.checked; currentPage = 0; render(); localStorage.setItem("sembunyikanSelesai", hideSelesai); });
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
