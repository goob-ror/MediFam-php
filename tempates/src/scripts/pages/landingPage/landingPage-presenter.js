import landingPageView from "./landingPage";
import landingPageModel from "./landingPage-model";
import NavbarPresenter from "../../components/navbar-presenter";

export default class LandingPagePresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new landingPageModel();
    this.navbarPresenter = null;
  }

  async init() {
    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    await this.model.getData();
  }

  render() {
    this.container.innerHTML = landingPageView();
    setTimeout(() => {
      this.setActiveNavLink();
    }, 10);
  }

  setActiveNavLink() {
    const navLinks = this.container.querySelectorAll(".landing-nav-link");
    const hash = window.location.hash || "#/";

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      link.classList.remove("active");
      if (hash === "#/" || hash === "#" || hash === "") {
        if (linkHref === "#/") {
          link.classList.add("active");
        }
      }
      else if (linkHref === hash) {
        link.classList.add("active");
      }
    });
  }

  attachEventListeners() {
    // Initialize navbar presenter
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();

    // Setup Intersection Observer for Jadwal section
    this.setupJadwalObserver();

    const registerNowBtn = this.container.querySelector(".btn-register-now");
    if (registerNowBtn) {
      registerNowBtn.addEventListener("click", () => {
        window.location.hash = "#/register";
      });
    }

    const safariScheduleBtn = this.container.querySelector(
      ".btn-safari-schedule"
    );
    if (safariScheduleBtn) {
      safariScheduleBtn.addEventListener("click", () => {
        this.scrollToSchedule();
      });
    }

    const berandaLinks = this.container.querySelectorAll('a[href="#/"]');
    berandaLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (
          window.location.hash === "#/" ||
          window.location.hash === "" ||
          window.location.hash === "#"
        ) {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    });

    const jadwalLinks = this.container.querySelectorAll('a[href="#/jadwal"]');
    jadwalLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (
          window.location.hash === "#/" ||
          window.location.hash === "" ||
          window.location.hash === "#"
        ) {
          e.preventDefault();
          window.location.hash = "#/jadwal";
          setTimeout(() => {
            this.scrollToSchedule();
          }, 100);
        }
      });
    });

    if (window.location.hash === "#/jadwal") {
      setTimeout(() => {
        this.scrollToSchedule();
      }, 200);
    }

    const featureButtons = this.container.querySelectorAll(".btn-feature");
    const safariContent = this.container.querySelector("#safariContent");
    const kbContent = this.container.querySelector("#kbContent");

    featureButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        featureButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const contentType = btn.getAttribute("data-content");

        if (contentType === "kb") {
          safariContent.style.display = "none";
          kbContent.style.display = "block";
        } else if (contentType === "safari") {
          safariContent.style.display = "block";
          kbContent.style.display = "none";
        }
      });
    });

    const faqItems = this.container.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          const isActive = item.classList.contains("active");

          faqItems.forEach((faqItem) => {
            faqItem.classList.remove("active");
            const answer = faqItem.querySelector(".faq-answer");
            if (answer) {
              answer.style.display = "none";
            }
          });

          if (!isActive) {
            item.classList.add("active");
            const answer = item.querySelector(".faq-answer");
            if (answer) {
              answer.style.display = "block";
            }
          }
        });
      }
    });

    if (faqItems.length > 0) {
      faqItems[0].classList.add("active");
      const firstAnswer = faqItems[0].querySelector(".faq-answer");
      if (firstAnswer) {
        firstAnswer.style.display = "block";
      }
    }
  }

  scrollToSchedule() {
    const scheduleSection = this.container.querySelector("#jadwal-section");
    if (scheduleSection) {
      const offsetTop = scheduleSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  setupJadwalObserver() {
    const berandaSection = this.container.querySelector("#beranda-section");
    const jadwalSection = this.container.querySelector("#jadwal-section");
    const berandaLink = this.container.querySelector('a[href="#/"]');
    const jadwalLink = this.container.querySelector('a[href="#/jadwal"]');

    if (!berandaSection || !jadwalSection || !berandaLink || !jadwalLink) return;

    // Observer for Beranda section (first section, more lenient)
    const berandaObserverOptions = {
      root: null,
      rootMargin: "0px 0px -80% 0px", // Active when top 20% is visible
      threshold: 0,
    };

    const berandaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          berandaLink.classList.add("nav-active");
          jadwalLink.classList.remove("nav-active");
        } else {
          berandaLink.classList.remove("nav-active");
        }
      });
    }, berandaObserverOptions);

    // Observer for Jadwal section
    const jadwalObserverOptions = {
      root: null,
      rootMargin: "-80px 0px -50% 0px", // Account for navbar, active when near top
      threshold: 0.1,
    };

    const jadwalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          jadwalLink.classList.add("nav-active");
          berandaLink.classList.remove("nav-active");
        } else {
          jadwalLink.classList.remove("nav-active");
        }
      });
    }, jadwalObserverOptions);

    // Start observing
    berandaObserver.observe(berandaSection);
    jadwalObserver.observe(jadwalSection);

    // Store observers for cleanup if needed
    this.berandaObserver = berandaObserver;
    this.jadwalObserver = jadwalObserver;
  }
}
