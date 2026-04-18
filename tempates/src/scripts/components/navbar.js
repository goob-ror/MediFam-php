export default function navbar(user = null) {
  // Not logged in - show login/register buttons
  if (!user) {
    return `
      <nav class="landing-navbar">
        <div class="landing-navbar-container">
          <!-- Logo -->
          <button class="landing-navbar-brand" href="#/">
            <img src="/public/logo/MediFam Tanpa Tulisan.png" alt="MediFam" class="navbar-logo" />
            <h1 class="navbar-title">MediFam</h1>
          </button>
          
          <!-- Toggle Button -->
          <button class="landing-navbar-toggle" type="button" id="landingNavbarToggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <!-- Navbar Items -->
          <div class="landing-navbar-menu" id="landingNavbarMenu">
            <ul class="landing-navbar-nav">
              <li class="landing-nav-item">
                <a class="landing-nav-link" href="#/">Beranda</a>
              </li>
              <li class="landing-nav-item">
                <a class="landing-nav-link" href="#/jadwal">Jadwal</a>
              </li>
              <li class="landing-nav-item">
                <a class="landing-nav-link" href="#/galeri">Galeri</a>
              </li>
            </ul>
          </div>
            
          <!-- Action Buttons -->
          <div class="landing-navbar-actions">
            <a href="#/login" class="btn-landing btn-outline">
              Log In
            </a>
            <a href="#/register" class="btn-landing btn-primary">
              Register
            </a>
          </div>
        </div>
      </nav>
    `;
  }

  // Logged in - show profile icon and dashboard link
  const isBidan = user.role === "bidan";
  const dashboardLink = isBidan ? "#/dashboard-bidan" : "#/dashboard-user";
  const dashboardText = isBidan ? "Dashboard Bidan" : "Dashboard Pengguna";
  // Handle both API response formats (login returns nama_lengkap, dashboard returns name)
  const userName = user.name || user.nama_lengkap || user.username || "User";
  const userAvatar = user.avatar || "/public/image/userAvatar-Male.png";

  return `
    <nav class="landing-navbar logged-in">
      <div class="landing-navbar-container">
        <!-- Logo -->
        <a class="landing-navbar-brand" href="#/">
          <img src="/public/logo/MediFam Tanpa Tulisan.png" alt="MediFam" class="navbar-logo" />
          <h1 class="navbar-title">MediFam</h1>
        </a>
        
        <!-- Toggle Button -->
        <button class="landing-navbar-toggle" type="button" id="landingNavbarToggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Navbar Items -->
        <div class="landing-navbar-menu" id="landingNavbarMenu">
          <ul class="landing-navbar-nav">
            <li class="landing-nav-item">
              <a class="landing-nav-link" href="#/">Beranda</a>
            </li>
            <li class="landing-nav-item">
              <a class="landing-nav-link" href="#/jadwal">Jadwal</a>
            </li>
            <li class="landing-nav-item">
              <a class="landing-nav-link" href="#/galeri">Galeri</a>
            </li>
            <li class="landing-nav-item">
              <a class="landing-nav-link" href="${dashboardLink}">${dashboardText}</a>
            </li>
          </ul>
        </div>
          
        <!-- Profile Icon with Dropdown -->
        <div class="landing-navbar-actions">
          <div class="navbar-profile-dropdown">
            <button class="profile-button" id="profileDropdownBtn">
              <img src="${userAvatar}" alt="${userName}" class="profile-avatar" />
              <span class="profile-name">${userName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="dropdown-icon">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </button>
            <div class="profile-dropdown-menu" id="profileDropdownMenu">
            ${isBidan ? `
              <a href="#/pengaturan-bidan" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                </svg>
                Pengaturan
              </a>
              <div class="dropdown-divider"></div>
              <a href="#/logout" class="dropdown-item logout-item" id="logoutBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                Logout
              </a>
            ` : `
              <a href="#/profile" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                Profile
              </a>
              <a href="#/pengaturan" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                </svg>
                Pengaturan
              </a>
              <div class="dropdown-divider"></div>
              <a href="#/logout" class="dropdown-item logout-item" id="logoutBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                Logout
              </a>
            `}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}
