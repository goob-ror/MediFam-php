import navbarView from "../../components/navbar";

export default function forgotPasswordView(step = "phone") {
  return `
    ${navbarView(null)}
    <section class="login-section">
      <div class="login-container">
        <div class="login-card">
          <div class="login-form-side">

            <div class="register-link-top">
              <a href="#/login" class="btn-create-account">
                Kembali Login
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </a>
            </div>

            <div class="login-header">
              <div class="lock-icon">
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.833a9.583 9.583 0 0 0-9.583 9.584v3.833H9.583A3.833 3.833 0 0 0 5.75 21.083v19.167a3.833 3.833 0 0 0 3.833 3.833h26.834a3.833 3.833 0 0 0 3.833-3.833V21.083a3.833 3.833 0 0 0-3.833-3.833h-3.834v-3.833A9.583 9.583 0 0 0 23 3.833zm0 24.917a3.833 3.833 0 1 1 0-7.667 3.833 3.833 0 0 1 0 7.667zm5.75-12.583H17.25v-3.834a5.75 5.75 0 1 1 11.5 0v3.834z" fill="black"/>
                </svg>
              </div>
              <h1 class="login-title">Lupa Password</h1>
              <p class="login-subtitle" id="fp-subtitle">Masukkan nomor WhatsApp yang terdaftar</p>
            </div>

            <!-- Step 1: Phone -->
            <div id="step-phone" class="fp-step ${step === "phone" ? "" : "fp-hidden"}">
              <form id="phoneForm">
                <div class="form-group">
                  <label class="form-label">Nomor WhatsApp</label>
                  <div class="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zm-1 1H6v1h4V2zm1 2H5v9h6V4zm-3 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    <input type="tel" id="phoneInput" class="form-input" placeholder="08xxxxxxxxxx" required />
                  </div>
                  <small class="fp-hint">OTP akan dikirim ke nomor WhatsApp ini</small>
                </div>
                <button type="submit" class="btn-submit" id="btnSendOtp">Kirim OTP</button>
              </form>
            </div>

            <!-- Step 2: OTP -->
            <div id="step-otp" class="fp-step fp-hidden">
              <form id="otpForm">
                <div class="form-group">
                  <label class="form-label">Kode OTP</label>
                  <div class="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                    </svg>
                    <input type="text" id="otpInput" class="form-input" placeholder="Masukkan 6 digit OTP" maxlength="6" required />
                  </div>
                  <div class="fp-timer-row">
                    <small class="fp-hint">Kode berlaku selama <span id="otpTimer">3:00</span></small>
                    <button type="button" class="fp-resend" id="btnResend" disabled>Kirim Ulang</button>
                  </div>
                </div>
                <button type="submit" class="btn-submit">Verifikasi OTP</button>
              </form>
            </div>

            <!-- Step 3: New Password -->
            <div id="step-password" class="fp-step fp-hidden">
              <form id="newPasswordForm">
                <div class="form-group">
                  <label class="form-label">Password Baru</label>
                  <div class="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                    <input type="password" id="newPasswordInput" class="form-input" placeholder="Minimal 6 karakter" required />
                    <button type="button" class="toggle-password" id="toggleNewPassword">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="eye-closed">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="eye-open" style="display:none">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Konfirmasi Password</label>
                  <div class="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                    <input type="password" id="confirmPasswordInput" class="form-input" placeholder="Ulangi password baru" required />
                  </div>
                </div>
                <button type="submit" class="btn-submit">Reset Password</button>
              </form>
            </div>

          </div>

          <div class="login-image-side">
            <img src="/public/image/login_illust.png" alt="Forgot Password" class="login-illustration" />
          </div>
        </div>
      </div>
    </section>
  `;
}
