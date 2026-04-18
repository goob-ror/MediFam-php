import dashboardUserView from "./dashboardUser";
import DashboardUserModel from "./dashboardUser-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class DashboardUserPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new DashboardUserModel();
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
    if (user && user.role === "bidan") {
      window.location.hash = "#/dashboard-bidan";
      return;
    }

    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      // Load dashboard data from API
      const dashboardData = await this.model.getDashboardData();
      this.user = dashboardData.user;
      this.upcomingRoutine = dashboardData.upcomingRoutine;

      // Load safari schedules
      this.safariSchedules = await this.model.getSafariSchedules();
    } catch (error) {
      console.error("Load data error:", error);
      alert("Gagal memuat data. Silakan refresh halaman.");
      this.user = {
        name: "User",
        avatar: "/public/logo/profile.png",
        joinDate: "N/A",
      };
      this.upcomingRoutine = null;
      this.safariSchedules = [];
    }
  }

  render() {
    this.container.innerHTML = dashboardUserView(
      this.user,
      this.upcomingRoutine,
      this.safariSchedules
    );
  }

  attachEventListeners() {
    // Initialize navbar presenter for dropdown and logout
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();

    // View Safari button
    const viewSafariBtn = this.container.querySelector("#viewSafariBtn");
    if (viewSafariBtn) {
      viewSafariBtn.addEventListener("click", () => {
        // Scroll to safari schedule table
        const safariSection = this.container.querySelector(
          ".safari-schedule-section"
        );
        if (safariSection) {
          safariSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Register for safari buttons
    const registerButtons = this.container.querySelectorAll(
      ".btn-register-safari"
    );
    registerButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const scheduleId = e.target.getAttribute("data-id");
        await this.handleRegisterSafari(scheduleId);
      });
    });

    // Cancel safari registration buttons
    const cancelButtons = this.container.querySelectorAll(".btn-cancel-safari");
    cancelButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const scheduleId = e.target.getAttribute("data-id");
        await this.handleCancelSafari(scheduleId);
      });
    });

    // Logout
    const logoutLink = this.container.querySelector(".logout");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }
  }

  async handleRegisterSafari(scheduleId) {
    // try {
    //   const result = await this.model.registerForSafari(scheduleId);
    //   if (result.success) {
    //     alert("Berhasil mendaftar untuk kegiatan SAFARI!");
    //     // Reload data and re-render
    //     await this.loadData();
    //     this.render();
    //     this.attachEventListeners();
    //   } else {
    //     alert(result.message || "Gagal mendaftar. Silakan coba lagi.");
    //   }
    // } catch (error) {
    //   console.error("Register safari error:", error);
    //   alert("Terjadi kesalahan. Silakan coba lagi.");
    // }
    const result = await Swal.fire ({
      title: "Daftar Kegiatan Safari?",
      text: "Anda yakin ingin mendaftar kegiatan safari ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51CBFF",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Daftar",
      cancelButtonText: "Tidak",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await this.model.registerForSafari(scheduleId);
      if (res.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil mendaftar kegiatan SAFARI!",
          confirmButtonColor: "#51CBFF",
        });
        await this.loadData();
        this.render();
        this.attachEventListeners();
      } else {
        throw new Error(res.message);
      } 
    } catch (error) {
      console.error("Register safari error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  async handleCancelSafari(scheduleId) {
    const result = await Swal.fire({
      title: "Batalkan Pendaftaran?",
      text: "Anda yakin ingin membatalkan pendaftaran kegiatan Safari ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tidak",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await this.model.cancelSafariRegistration(scheduleId);
      if (res.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pendaftaran berhasil dibatalkan.",
          confirmButtonColor: "#51CBFF",
        });
        await this.loadData();
        this.render();
        this.attachEventListeners();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("Cancel safari error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        confirmButtonColor: "#51CBFF",
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
