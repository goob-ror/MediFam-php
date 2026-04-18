import pengaturanView from "./pengaturan";
import PengaturanModel from "./pengaturan-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class PengaturanPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new PengaturanModel();
  }

  async init() {
    await this.loadData();
    this.render();
    this.attachEventListeners();
    this.loadNotificationSettings();
  }

  async loadData() {
    try {
      const dashboardData = await this.model.getDashboardData();
      this.user = dashboardData.user;
      this.receiveAutoreminder = dashboardData.user.receive_autoreminder ?? true;
    } catch (error) {
      console.error("Load user data error:", error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.user = {
          name: user.nama_lengkap || user.username,
          avatar: user.avatar || "/public/image/userAvatar-Male.png",
          joinDate: "N/A",
          role: user.role,
        };
        this.receiveAutoreminder = true;
      } else {
        window.location.hash = "#/login";
        return;
      }
    }
  }

  render() {
    this.container.innerHTML = pengaturanView(this.user);
  }

  attachEventListeners() {
    const navbarPresenter = new NavbarPresenter(this.container);
    navbarPresenter.attachEventListeners();

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

    // Logout
    const logoutLink = this.container.querySelector(".nav-item.logout");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
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
    } catch (error) {
      console.error("Update notification error:", error);
      // Revert the toggle on failure
      const checkbox = this.container.querySelector("#whatsappNotif");
      if (checkbox) checkbox.checked = !isEnabled;
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
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Password dan Konfirmasi Password tidak cocok!",
          confirmButtonColor: "#51CBFF",
        });
        return;
      }

      if (password.length < 6) {
        await Swal.fire({
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
      await Swal.fire({
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
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.hash = "#/";
    }
  }
}
