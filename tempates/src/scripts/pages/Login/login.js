import navbarView from "../../components/navbar";

export default function loginView() {
  return `
    ${navbarView(null)}

    <section class="login-section">
        <div class="login-container">
            <div class="login-card">
                <div class="login-form-side">
                    <div class="register-link-top">
                        <a href="#/register" class="btn-create-account">
                            Buat Akun Anda
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </a>
                    </div>

                    <div class="login-header">
                        <div class="lock-icon">
                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 42.1667C10.4458 42.1667 9.54368 41.7917 8.79363 41.0417C8.04357 40.2916 7.6679 39.3889 7.66663 38.3334V19.1667C7.66663 18.1126 8.04229 17.2105 8.79363 16.4604C9.54496 15.7104 10.4471 15.3347 11.5 15.3334H13.4166V11.5001C13.4166 8.84869 14.3513 6.58894 16.2207 4.72083C18.0901 2.85272 20.3498 1.91803 23 1.91675C25.6501 1.91547 27.9105 2.85017 29.7811 4.72083C31.6518 6.5915 32.5858 8.85125 32.5833 11.5001V15.3334H34.5C35.5541 15.3334 36.4569 15.7091 37.2082 16.4604C37.9595 17.2117 38.3346 18.1139 38.3333 19.1667V38.3334C38.3333 39.3876 37.9583 40.2903 37.2082 41.0417C36.4582 41.793 35.5554 42.168 34.5 42.1667H11.5ZM23 32.5834C24.0541 32.5834 24.9569 32.2084 25.7082 31.4583C26.4595 30.7083 26.8346 29.8055 26.8333 28.7501C26.832 27.6946 26.457 26.7925 25.7082 26.0438C24.9594 25.295 24.0567 24.9193 23 24.9167C21.9432 24.9142 21.0411 25.2899 20.2936 26.0438C19.5461 26.7976 19.1705 27.6997 19.1666 28.7501C19.1628 29.8004 19.5385 30.7032 20.2936 31.4583C21.0488 32.2135 21.9509 32.5885 23 32.5834ZM17.25 15.3334H28.75V11.5001C28.75 9.90286 28.1909 8.54522 27.0729 7.42717C25.9548 6.30911 24.5972 5.75008 23 5.75008C21.4027 5.75008 20.0451 6.30911 18.927 7.42717C17.809 8.54522 17.25 9.90286 17.25 11.5001V15.3334Z" fill="black"/>
                            </svg>
                        </div>
                        <h1 class="login-title">Selamat Datang Kembali!</h1>
                        <p class="login-subtitle">Login untuk mengakses akun Anda</p>
                    </div>

                    <form class="login-form" id="loginForm">
                        <div class="form-group">
                            <label for="username" class="form-label">Username</label>
                            <div class="input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    class="form-input" 
                                    placeholder="Puskesmas Palaran"
                                    required
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <div class="input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                </svg>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    class="form-input" 
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" class="toggle-password" id="togglePassword">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="eye-closed">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="eye-open" style="display: none;">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                    </svg>
                                </button>
                            </div>
                            <a href="#/forgot-password" class="forgot-password">Lupa Password?</a>
                        </div>

                        <div class="recaptcha-wrapper">
                            <div id="recaptcha-login"></div>
                        </div>

                        <button type="submit" class="btn-submit">Submit</button>

                        <p class="register-link">
                            Belum punya akun? Daftar <a href="#/register">disini</a>
                        </p>
                    </form>
                </div>

                <div class="login-image-side">
                    <img src="/public/image/login_illust.png" alt="Login Illustration" class="login-illustration" />
                </div>
            </div>
        </div>
    </section>
    `;
}
