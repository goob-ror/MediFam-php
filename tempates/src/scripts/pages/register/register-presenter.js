import registerView from "./register";
import RegisterModel from "./register-model";

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

export default class RegisterPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new RegisterModel();
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
        this.recaptchaWidgetId = window.grecaptcha.render("recaptcha-register", {
          sitekey: RECAPTCHA_SITE_KEY,
        });
        resolve();
      });
    });
  }

  render() {
    this.container.innerHTML = registerView();
  }

  attachEventListeners() {
    // Toggle password visibility for both password fields
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

    // Handle form submission
    const registerForm = this.container.querySelector("#registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleRegister(e);
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

  async handleRegister(e) {
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Password dan Confirm Password tidak cocok!");
      return;
    }

    const recaptchaToken = window.grecaptcha?.getResponse(this.recaptchaWidgetId);
    if (!recaptchaToken) {
      alert("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    try {
      const result = await this.model.register(username, phone, password);

      if (result.success) {
        alert("Registrasi berhasil! Silakan login.");
        window.location.hash = "#/login";
      } else {
        window.grecaptcha?.reset(this.recaptchaWidgetId);
        alert(result.message || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Register error:", error);
      window.grecaptcha?.reset(this.recaptchaWidgetId);
      alert("Terjadi kesalahan saat registrasi. Silakan coba lagi.");
    }
  }
}
