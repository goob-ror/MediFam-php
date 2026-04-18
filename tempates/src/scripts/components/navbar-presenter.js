import authService from "../services/auth-service";
import Swal from "sweetalert2";

export default class NavbarPresenter {
  constructor(container) {
    this.container = container;
    this.documentClickHandler = null;
  }

  attachEventListeners() {
    // Set active nav link based on current route
    this.setActiveNavLink();

    // Navbar toggle for mobile
    const navbarToggle = this.container.querySelector("#landingNavbarToggle");
    const navbarMenu = this.container.querySelector("#landingNavbarMenu");
    
    if (navbarToggle && navbarMenu) {
      navbarToggle.addEventListener("click", () => {
        navbarMenu.classList.toggle("active");
      });
    }

    // Profile dropdown toggle
    const profileDropdownBtn = this.container.querySelector("#profileDropdownBtn");
    const profileDropdownMenu = this.container.querySelector("#profileDropdownMenu");
    
    if (profileDropdownBtn && profileDropdownMenu) {
      // Remove previous document click handler if exists
      if (this.documentClickHandler) {
        document.removeEventListener("click", this.documentClickHandler);
      }

      // Profile button click handler
      profileDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = profileDropdownMenu.classList.toggle("show");
        
        // Rotate arrow icon
        profileDropdownBtn.classList.toggle("active", isOpen);
      });

      // Close dropdown when clicking outside
      this.documentClickHandler = (e) => {
        if (!profileDropdownBtn.contains(e.target) && !profileDropdownMenu.contains(e.target)) {
          profileDropdownMenu.classList.remove("show");
          profileDropdownBtn.classList.remove("active");
        }
      };
      
      document.addEventListener("click", this.documentClickHandler);

      // Close dropdown when clicking on dropdown items
      const dropdownItems = profileDropdownMenu.querySelectorAll(".dropdown-item");
      dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
          profileDropdownMenu.classList.remove("show");
          profileDropdownBtn.classList.remove("active");
        });
      });
    }

    // Logout button (navbar dropdown)
    const logoutBtn = this.container.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }

    // Sidebar logout link
    const sidebarLogout = this.container.querySelector(".nav-item.logout");
    if (sidebarLogout) {
      sidebarLogout.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleLogout();
      });
    }

    // Handle Jadwal link - scroll to section if on landing page
    const jadwalLink = this.container.querySelector('a[href="#/jadwal"]');
    if (jadwalLink) {
      jadwalLink.addEventListener("click", (e) => {
        const currentHash = window.location.hash;
        if (currentHash === "#/" || currentHash === "" || currentHash === "#") {
          e.preventDefault();
          this.scrollToJadwal();
        }
      });
    }
  }

  setActiveNavLink() {
    const navLinks = this.container.querySelectorAll(".landing-nav-link");
    const hash = window.location.hash || "#/";
    const path = hash.split("?")[0]; // strip query params

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      link.classList.remove("nav-active");

      // Exact match for root
      if (path === "#/" || path === "#" || path === "") {
        if (linkHref === "#/") link.classList.add("nav-active");
        return;
      }

      // Exact match
      if (linkHref === path) {
        link.classList.add("nav-active");
        return;
      }

      // Group all bidan-area routes under the dashboard-bidan nav link
      const bidanPaths = [
        "/dashboard-bidan", "/manajemen-pasien", "/manajemen-pendaftar",
        "/manajemen-sesi", "/form-session", "/pengaturan-bidan", "/pasien",
      ];
      const isBidanArea = bidanPaths.some((r) => path.includes(r));
      if (isBidanArea && linkHref === "#/dashboard-bidan") {
        link.classList.add("nav-active");
        return;
      }

      // Group all user-area routes under the dashboard-user nav link
      const userPaths = [
        "/dashboard-user", "/konsultasi", "/history",
        "/pengaturan", "/profile",
      ];
      const isUserArea = userPaths.some((r) => path.includes(r));
      if (isUserArea && linkHref === "#/dashboard-user") {
        link.classList.add("nav-active");
      }

      console.log("PATH:", path);
      console.log("LINK:", linkHref);
    });
  }

  scrollToJadwal() {
    const jadwalSection = document.querySelector("#jadwal-section");
    if (jadwalSection) {
      const offsetTop = jadwalSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  async handleLogout() {
    const result = await Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      authService.logout();
    }
  }
}
