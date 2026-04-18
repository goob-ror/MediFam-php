import forgotPasswordView from "./forgotPassword";
import ForgotPasswordModel from "./forgotPassword-model";

export default class ForgotPasswordPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new ForgotPasswordModel();
    this.phone = null;
    this.otp = null;
    this.timerInterval = null;
  }

  init() {
    this.container.innerHTML = forgotPasswordView();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Step 1 — request OTP
    this.container.querySelector("#phoneForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleRequestOtp();
    });

    // Step 2 — verify OTP
    this.container.querySelector("#otpForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleVerifyOtp();
    });

    // Step 3 — reset password
    this.container.querySelector("#newPasswordForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleResetPassword();
    });

    // Resend OTP
    this.container.querySelector("#btnResend").addEventListener("click", async () => {
      await this.handleRequestOtp(true);
    });

    // Toggle password visibility
    const toggle = this.container.querySelector("#toggleNewPassword");
    const input = this.container.querySelector("#newPasswordInput");
    toggle.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.querySelector(".eye-closed").style.display = isPassword ? "none" : "block";
      toggle.querySelector(".eye-open").style.display = isPassword ? "block" : "none";
    });
  }

  async handleRequestOtp(isResend = false) {
    const phoneRaw = this.container.querySelector("#phoneInput").value.trim();
    const phone = phoneRaw.replace(/\D/g, "");

    if (!phone || phone.length < 9) {
      alert("Masukkan nomor WhatsApp yang valid.");
      return;
    }

    const btn = this.container.querySelector(isResend ? "#btnResend" : "#btnSendOtp");
    btn.disabled = true;
    btn.textContent = "Mengirim...";

    try {
      const result = await this.model.requestOtp(phone);
      if (result.success) {
        this.phone = phone;
        this.showStep("otp");
        this.container.querySelector("#fp-subtitle").textContent =
          `OTP dikirim ke WhatsApp ${phoneRaw}`;
        this.startTimer(3 * 60);
      } else {
        alert(result.message || "Gagal mengirim OTP.");
        btn.disabled = false;
        btn.textContent = isResend ? "Kirim Ulang" : "Kirim OTP";
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
      btn.disabled = false;
      btn.textContent = isResend ? "Kirim Ulang" : "Kirim OTP";
    }
  }

  async handleVerifyOtp() {
    const otp = this.container.querySelector("#otpInput").value.trim();
    if (otp.length !== 6) {
      alert("Masukkan 6 digit kode OTP.");
      return;
    }

    const btn = this.container.querySelector("#otpForm .btn-submit");
    btn.disabled = true;
    btn.textContent = "Memverifikasi...";

    try {
      const result = await this.model.verifyOtp(this.phone, otp);
      if (result.success) {
        this.otp = otp;
        clearInterval(this.timerInterval);
        this.showStep("password");
        this.container.querySelector("#fp-subtitle").textContent =
          "Buat password baru Anda";
      } else {
        alert(result.message || "OTP tidak valid atau sudah kadaluarsa.");
        btn.disabled = false;
        btn.textContent = "Verifikasi OTP";
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
      btn.disabled = false;
      btn.textContent = "Verifikasi OTP";
    }
  }

  async handleResetPassword() {
    const newPassword = this.container.querySelector("#newPasswordInput").value;
    const confirmPassword = this.container.querySelector("#confirmPasswordInput").value;

    if (newPassword.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    const btn = this.container.querySelector("#newPasswordForm .btn-submit");
    btn.disabled = true;
    btn.textContent = "Menyimpan...";

    try {
      const result = await this.model.resetPassword(this.phone, this.otp, newPassword);
      if (result.success) {
        alert("Password berhasil direset. Silakan login dengan password baru.");
        window.location.hash = "#/login";
      } else {
        alert(result.message || "Gagal mereset password.");
        btn.disabled = false;
        btn.textContent = "Reset Password";
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
      btn.disabled = false;
      btn.textContent = "Reset Password";
    }
  }

  showStep(step) {
    ["phone", "otp", "password"].forEach((s) => {
      const el = this.container.querySelector(`#step-${s}`);
      el.classList.toggle("fp-hidden", s !== step);
    });
  }

  startTimer(seconds) {
    clearInterval(this.timerInterval);
    const timerEl = this.container.querySelector("#otpTimer");
    const resendBtn = this.container.querySelector("#btnResend");
    resendBtn.disabled = true;

    let remaining = seconds;
    const update = () => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        timerEl.textContent = "0:00";
        resendBtn.disabled = false;
      }
      remaining--;
    };
    update();
    this.timerInterval = setInterval(update, 1000);
  }

  normalizePhone(phone) {
    // Convert 08xx → 628xx
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("08")) return "62" + digits.slice(1);
    if (digits.startsWith("628")) return digits;
    if (digits.startsWith("8")) return "62" + digits;
    return digits;
  }
}
