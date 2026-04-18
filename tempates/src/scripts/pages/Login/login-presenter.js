import loginView from "./login";
import LoginModel from "./login-model";

const RECAPTCHA_SITE_KEY = "6LeUTZcsAAAAAEoS9xMKLQMpQR545dzCCe55lbMb";

function loadRecaptchaScript() {
  return new Promise((resolve) => {
    if (window.grecaptcha) return resolve();
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

export default class LoginPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new LoginModel();
    this.recaptchaWidgetId = null;
  }

  async init() {
    this.render();
    await this.initRecaptcha();
    this.attachEventListeners();
  }

  async initRecaptcha() {
    await loadRecaptchaScript();
    await new Promise((resolve) => {
      window.grecaptcha.ready(() => {
        this.recaptchaWidgetId = window.grecaptcha.render("recaptcha-login", {
          sitekey: RECAPTCHA_SITE_KEY,
        });
        resolve();
      });
    });
  }

  render() {
    this.container.innerHTML = loginView();
  }

  attachEventListeners() {
    // Toggle password visibility
    const togglePassword = this.container.querySelector("#togglePassword");
    const passwordInput = this.container.querySelector("#password");
    const eyeOpen = togglePassword?.querySelector(".eye-open");
    const eyeClosed = togglePassword?.querySelector(".eye-closed");

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);

        if (eyeOpen && eyeClosed) {
          eyeClosed.style.display = type === "password" ? "block" : "none";
          eyeOpen.style.display = type === "text" ? "block" : "none";
        }
      });
    }

    // Handle form submission
    const loginForm = this.container.querySelector("#loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleLogin(e);
      });
    }

    // Navbar toggle
    const navbarToggle = this.container.querySelector("#landingNavbarToggle");
    const navbarMenu = this.container.querySelector("#landingNavbarMenu");
    if (navbarToggle && navbarMenu) {
      navbarToggle.addEventListener("click", () => {
        navbarMenu.classList.toggle("active");
      });
    }
  }

  async handleLogin(e) {
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const recaptchaToken = window.grecaptcha?.getResponse(this.recaptchaWidgetId);
    if (!recaptchaToken) {
      alert("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    try {
      const result = await this.model.login(username, password);

      if (result.success) {
        // Redirect based on role
        if (result.data.user.role === "bidan") {
          window.location.hash = "#/dashboard-bidan";
        } else {
          window.location.hash = "#/dashboard-user";
        }
      } else {
        window.grecaptcha?.reset(this.recaptchaWidgetId);
        alert(
          result.message || "Login gagal. Periksa username dan password Anda."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      window.grecaptcha?.reset(this.recaptchaWidgetId);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  }
}
