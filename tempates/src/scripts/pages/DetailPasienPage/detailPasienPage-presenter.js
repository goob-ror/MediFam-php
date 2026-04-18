import detailPasienView from "./detailPasienPage";
import DetailPasienModel from "./detailPasienPage-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class DetailPasienPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new DetailPasienModel();
    this.patient = null;
    this.history = [];
    this.patientId = this._getIdFromHash();
  }

  _getIdFromHash() {
    const match = window.location.hash.match(/\/pasien\/(\d+)/);
    return match ? match[1] : null;
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

    const user = authService.getUser();
    if (!user || user.role !== "bidan") {
      window.location.hash = "#/dashboard-bidan";
      return;
    }

    if (!this.patientId) {
      window.location.hash = "#/manajemen-pasien";
      return;
    }

    const userData = authService.getUser();
    this.user = {
      name: userData.nama_lengkap || userData.username || "Bidan",
      username: userData.username,
      avatar: "/public/image/userAvatar-Female.png",
      joinDate: new Date(userData.created_at || Date.now()).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      }),
      role: userData.role,
    };

    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      const [detailRes, historyRes] = await Promise.all([
        this.model.getPatientDetail(this.patientId),
        this.model.getPatientHistory(this.patientId),
      ]);

      if (detailRes.success) {
        this.patient = detailRes.data.patient;
      } else {
        throw new Error(detailRes.message || "Gagal memuat detail pasien");
      }

      if (historyRes.success) {
        this.history = historyRes.data.history || [];
      }
    } catch (error) {
      console.error("Load data error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.message,
        confirmButtonColor: "#51CBFF",
      });
    }
  }

  render() {
    this.container.innerHTML = detailPasienView(this.user, this.patient, this.history);
  }

  attachEventListeners() {
    const navbarPresenter = new NavbarPresenter(this.container);
    navbarPresenter.attachEventListeners();

    const logoutBtn = this.container.querySelector(".nav-item.logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        authService.logout();
      });
    }

    this.container.querySelectorAll(".history-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.index;
        const body = this.container.querySelector(`#history-body-${idx}`);
        const isOpen = btn.classList.contains("is-open");
        btn.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        if (body) body.hidden = isOpen;
      });
    });
  }
}
