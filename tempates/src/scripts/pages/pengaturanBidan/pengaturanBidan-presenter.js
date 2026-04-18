import pengaturanBidanView from "./pengaturanBidan";
import PengaturanBidanModel from "./pengaturanBidan-model";
import authService from "../../services/auth-service";
import API_BASE_URL from "../../services/api-config";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class PengaturanBidanPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new PengaturanBidanModel();
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

    await this.loadUserData();
    this.render();
    this.attachEventListeners();
    this.loadNotificationSettings();
  }

  async loadUserData() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const userData = data.success ? data.data.user : authService.getUser();

      const createdDate = new Date(userData.created_at || Date.now());
      this.receiveAutoreminder = userData.receive_autoreminder ?? 1;

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
      this.receiveAutoreminder = 1;
      this.user = {
        name: "Bidan",
        username: "bidan",
        avatar: "/public/image/userAvatar-Female.png",
        joinDate: "01 Desember 2025",
        role: "bidan",
      };
    }
  }

  render() {
    this.container.innerHTML = pengaturanBidanView(this.user);
  }

  attachEventListeners() {
    // Initialize navbar presenter
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();

    // Toggle password visibility
    const toggleButtons = this.container.querySelectorAll(".toggle-password");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const passwordInput = this.container.querySelector(`#${targetId}`);
        const eyeOpen = button.querySelector(".eye-open");
        const eyeClosed = button.querySelector(".eye-closed");

        if (passwordInput) {
          const type =
            passwordInput.getAttribute("type") === "password"
              ? "text"
              : "password";
          passwordInput.setAttribute("type", type);

          if (eyeOpen && eyeClosed) {
            eyeClosed.style.display = type === "password" ? "block" : "none";
            eyeOpen.style.display = type === "text" ? "block" : "none";
          }
        }
      });
    });

    // Account settings form
    const accountForm = this.container.querySelector("#accountSettingsForm");
    if (accountForm) {
      accountForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleAccountUpdate(e);
      });
    }

    // WhatsApp notification toggle
    const whatsappNotif = this.container.querySelector("#whatsappNotif");
    if (whatsappNotif) {
      whatsappNotif.addEventListener("change", (e) => {
        this.handleNotificationToggle(e.target.checked);
      });
    }

    // Logout button
    const logoutBtn = this.container.querySelector(".nav-item.logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }
  }

  loadNotificationSettings() {
    const checkbox = this.container.querySelector("#whatsappNotif");
    if (checkbox) {
      checkbox.checked = this.receiveAutoreminder === 1 || this.receiveAutoreminder === true;
    }
  }

  async handleNotificationToggle(isEnabled) {
    try {
      await this.model.updateNotification(isEnabled);
      this.receiveAutoreminder = isEnabled ? 1 : 0;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: isEnabled ? "Notifikasi WhatsApp otomatis diaktifkan" : "Notifikasi WhatsApp otomatis dinonaktifkan",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Update notification error:", error);
      // Revert toggle on failure
      const checkbox = this.container.querySelector("#whatsappNotif");
      if (checkbox) checkbox.checked = !isEnabled;

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui pengaturan notifikasi",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  }

  async handleAccountUpdate(e) {
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate passwords match if password is being changed
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Password dan Konfirmasi Password tidak cocok!",
          confirmButtonColor: "#51CBFF",
        });
        return;
      }

      if (password.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Password minimal 6 karakter!",
          confirmButtonColor: "#51CBFF",
        });
        return;
      }
    }

    try {
      const updateData = {
        username,
      };

      // Only include password if it's being changed
      if (password) {
        updateData.password = password;
      }

      const result = await this.model.updateAccount(updateData);

      if (result.success) {
        // Update user data in localStorage
        const currentUser = authService.getUser();
        const updatedUser = {
          ...currentUser,
          username: username,
          nama_lengkap: username,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update local user object
        this.user.username = username;
        this.user.name = username;

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil diperbarui!",
          confirmButtonColor: "#51CBFF",
        });

        // Clear password fields
        this.container.querySelector("#password").value = "";
        this.container.querySelector("#confirmPassword").value = "";

        // Re-render to update the sidebar and navbar
        this.render();
        this.attachEventListeners();
        this.loadNotificationSettings();
      } else {
        throw new Error(result.message || "Gagal memperbarui data");
      }
    } catch (error) {
      console.error("Update account error:", error);
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
