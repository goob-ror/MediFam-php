import LandingPagePresenter from "./scripts/pages/landingPage/landingPage-presenter";
import LoginPresenter from "./scripts/pages/Login/login-presenter";
import RegisterPresenter from "./scripts/pages/register/register-presenter";
import DashboardUserPresenter from "./scripts/pages/dashboardUser/dashboardUser-presenter";
import DashboardBidanPresenter from "./scripts/pages/DashboardBidan/dashboardBidan-presenter";
import KonsultasiPresenter from "./scripts/pages/konsultasi/konsultasi-presenter";
import HistoryPresenter from "./scripts/pages/history/history-presenter";
import PengaturanPresenter from "./scripts/pages/pengaturan/pengaturan-presenter";
import PengaturanBidanPresenter from "./scripts/pages/pengaturanBidan/pengaturanBidan-presenter";
import GaleriPresenter from "./scripts/pages/galeri/galeri-presenter";
import ProfilePresenter from "./scripts/pages/profile/profile-presenter";
import ManajemenPasienPresenter from "./scripts/pages/manajemenPasien/manajemenPasien-presenter";
import ManajemenSesiPresenter from "./scripts/pages/manajemenSesi/manajemenSesi-presenter";
import ManajemenPendaftarPresenter from "./scripts/pages/manajemenPendaftar/manajemenPendaftar-presenter";
import FormSessionPresenter from "./scripts/pages/formSessionPage/formSession-presenter";
import ForgotPasswordPresenter from "./scripts/pages/forgotPassword/forgotPassword-presenter";
import DetailPasienPresenter from "./scripts/pages/DetailPasienPage/detailPasienPage-presenter";
import authService from "./scripts/services/auth-service";

const routes = {
  "/": LandingPagePresenter,
  "/login": LoginPresenter,
  "/register": RegisterPresenter,
  "/dashboard-user": DashboardUserPresenter,
  "/dashboard-bidan": DashboardBidanPresenter,
  "/konsultasi": KonsultasiPresenter,
  "/history": HistoryPresenter,
  "/pengaturan": PengaturanPresenter,
  "/pengaturan-bidan": PengaturanBidanPresenter,
  "/galeri": GaleriPresenter,
  "/profile": ProfilePresenter,
  "/manajemen-pasien": ManajemenPasienPresenter,
  "/manajemen-sesi": ManajemenSesiPresenter,
  "/manajemen-pendaftar": ManajemenPendaftarPresenter,
  "/form-session": FormSessionPresenter,
  "/forgot-password": ForgotPasswordPresenter,
};

const protectedRoutes = [
  "/dashboard-user",
  "/dashboard-bidan",
  "/konsultasi",
  "/history",
  "/pengaturan",
  "/pengaturan-bidan",
  "/profile",
  "/manajemen-pasien",
  "/manajemen-sesi",
  "/manajemen-pendaftar",
  "/form-session",
  "/pasien",
];

// Routes that use the fixed dashboard layout
const dashboardRoutes = [
  "/dashboard-user",
  "/dashboard-bidan",
  "/konsultasi",
  "/history",
  "/pengaturan",
  "/pengaturan-bidan",
  "/profile",
  "/manajemen-pasien",
  "/manajemen-sesi",
  "/manajemen-pendaftar",
  "/form-session",
  "/pasien",
];

function getRoute() {
  const hash = (window.location.hash.slice(1) || "/").split("?")[0];
  if (routes[hash]) return routes[hash];
  // Dynamic route: /pasien/:id
  if (/^\/pasien\/\d+$/.test(hash)) return DetailPasienPresenter;
  return routes["/"];
}

function checkAuth(hash) {
  const path = hash.split("?")[0];
  // Check exact match or dynamic prefix
  const isProtected =
    protectedRoutes.includes(path) ||
    /^\/pasien\/\d+$/.test(path);
  if (isProtected) {
    if (!authService.isAuthenticated()) {
      window.location.hash = "#/login";
      return false;
    }
  }
  return true;
}

function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".landing-nav-link");
  const hash = window.location.hash || "#/";

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    link.classList.remove("active");

    if (hash === "#/" || hash === "#" || hash === "") {
      if (linkHref === "#/") {
        link.classList.add("active");
      }
    } else if (linkHref === hash) {
      link.classList.add("active");
    }
  });
}

function handleRouteChange() {
  const container = document.getElementById("app");
  if (!container) {
    console.error("Container dengan id 'app' tidak ditemukan!");
    return;
  }

  const hash = window.location.hash.slice(1) || "/";

  // Check authentication for protected routes
  if (!checkAuth(hash)) {
    return;
  }

  // Toggle dashboard layout class so layout-fix.css only applies to dashboard pages
  const path = hash.split("?")[0];
  document.body.classList.toggle(
    "has-dashboard",
    dashboardRoutes.includes(path) || /^\/pasien\/\d+$/.test(path)
  );

  // Render new page immediately
  const Presenter = getRoute();
  const presenter = new Presenter({ container });
  presenter.init();

  setTimeout(() => {
    setActiveNavLink();
  }, 50);

  if (
    window.location.hash === "#/" ||
    window.location.hash === "" ||
    window.location.hash === "#"
  ) {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }

  if (window.location.hash === "#/jadwal") {
    setTimeout(() => {
      const jadwalSection = container.querySelector("#jadwal-section");
      if (jadwalSection) {
        const offsetTop = jadwalSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }, 200);
  }
}

export function initRouter() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleRouteChange);
  } else {
    handleRouteChange();
  }

  window.addEventListener("hashchange", handleRouteChange);
}
