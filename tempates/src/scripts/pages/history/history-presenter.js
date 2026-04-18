import historyView from "./history";
import HistoryModel from "./history-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class HistoryPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new HistoryModel();
    this.user = null;
    this.safariHistory = [];
    this.pelayananHistory = [];
  }

  async init() {
    if (!authService.isAuthenticated()) {
      window.location.hash = "#/login";
      return;
    }

    const authCheck = await authService.checkAuth();
    if (!authCheck.success) {
      authService.logout();
      return;
    }

    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      const [dashboardData, historyData] = await Promise.all([
        this.model.getDashboardData(),
        this.model.getHistory(),
      ]);

      this.user = dashboardData.user;
      this.safariHistory = historyData.safari || [];
      this.pelayananHistory = historyData.pelayanan || [];
    } catch (error) {
      console.error("Load history error:", error);
      // Fallback user from authService
      const stored = authService.getUser();
      this.user = {
        name: stored?.nama_lengkap || stored?.username || "Pengguna",
        avatar: stored?.profile_image || "/public/image/userAvatar-Male.png",
        joinDate: "-",
        role: stored?.role,
      };
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message,
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  render() {
    this.container.innerHTML = historyView(this.user, this.safariHistory, this.pelayananHistory);
  }

  attachEventListeners() {
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
