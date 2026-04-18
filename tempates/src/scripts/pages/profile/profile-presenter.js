import profileView from "./profile";
import ProfileModel from "./profile-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class ProfilePresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new ProfileModel();
  }

  async init() {
    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
      try {
          const dashboardData = await this.model.getDashboardData();
          this.user = dashboardData.user;
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
                  role: user.role
              };
          } else {
              // Redirect to login if no user data
              window.location.hash = "#/login";
              return;
          }
      }

    // Load profile data
    this.profileData = await this.model.getProfileData();
    this.profileData.isComplete = this.checkProfileComplete(this.profileData);
    this.kontrasepsiList = await this.model.getKontrasepsiList();
    // Track selected preference IDs
    this.selectedKbIds = (this.profileData.kontrasepsi_yang_diinginkan || "")
      .split(",").map((s) => s.trim()).filter(Boolean);
  }

  _toggleProfileTag(tagEl) {
    const id = String(tagEl.dataset.id);
    const idx = this.selectedKbIds.indexOf(id);
    const isSelecting = idx === -1;

    if (isSelecting) {
      this.selectedKbIds.push(id);
      tagEl.classList.add("selected");
    } else {
      this.selectedKbIds.splice(idx, 1);
      tagEl.classList.remove("selected");
    }

    this._renderProfileTags();
    this._showKeteranganToast(isSelecting ? id : null);
  }

  _showKeteranganToast(id) {
    const toast = this.container.querySelector("#kbKeteranganToast");
    if (!toast) return;

    // Clear any running timer
    if (this._keteranganTimer) {
      clearTimeout(this._keteranganTimer);
      this._keteranganTimer = null;
    }

    // Deselected — hide immediately
    if (!id) {
      toast.style.display = "none";
      return;
    }

    const k = (this.kontrasepsiList || []).find((x) => String(x.id) === id);
    const keterangan = k?.keterangan;

    if (!keterangan) {
      toast.style.display = "none";
      return;
    }

    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span><strong>${k.nama}</strong> — ${keterangan}</span>
      <div class="kb-keterangan-progress" id="kbKeteranganProgress"></div>
    `;
    toast.style.display = "flex";
    toast.classList.remove("kb-keterangan-hide");

    // Animate progress bar over 15s
    const progress = toast.querySelector("#kbKeteranganProgress");
    if (progress) {
      progress.style.transition = "none";
      progress.style.width = "100%";
      // Force reflow then start shrinking
      progress.getBoundingClientRect();
      progress.style.transition = "width 15s linear";
      progress.style.width = "0%";
    }

    this._keteranganTimer = setTimeout(() => {
      toast.classList.add("kb-keterangan-hide");
      setTimeout(() => { toast.style.display = "none"; }, 300);
    }, 15000);
  }

  _renderProfileTags() {
    const container = this.container.querySelector("#profileTagSelected");
    const hiddenInput = this.container.querySelector("#kontrasepsiDiinginkan");
    if (!container) return;

    if (this.selectedKbIds.length === 0) {
      container.innerHTML = `<span class="fs-tag-placeholder">Pilih preferensi kontrasepsi...</span>`;
      if (hiddenInput) hiddenInput.value = "";
    } else {
      const chips = this.selectedKbIds.map((id) => {
        const k = (this.kontrasepsiList || []).find((x) => String(x.id) === id);
        const nama = k ? k.nama : id;
        return `
          <span class="fs-tag-chip">
            ${nama}
            <button type="button" class="fs-tag-chip-remove" data-id="${id}">×</button>
          </span>
        `;
      }).join("");
      container.innerHTML = chips;
      if (hiddenInput) hiddenInput.value = this.selectedKbIds.join(", ");

      container.querySelectorAll(".fs-tag-chip-remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tagEl = this.container.querySelector(`.profile-kb-tag[data-id="${btn.dataset.id}"]`);
          if (tagEl) this._toggleProfileTag(tagEl);
        });
      });
    }
  }

  checkProfileComplete(profile) {
    return !!(
      profile.nama_lengkap &&
      profile.nik &&
      profile.jenis_kelamin &&
      profile.no_hp
    );
  }

  render() {
    this.container.innerHTML = profileView(this.user, this.profileData, this.kontrasepsiList);
  }

  attachEventListeners() {
    const navbarPresenter = new NavbarPresenter(this.container);
    navbarPresenter.attachEventListeners();

    // Tab switching
    const tabButtons = this.container.querySelectorAll(".tab-button");
    const tabContents = this.container.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");
        
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        
        // Add active class to clicked tab and corresponding content
        button.classList.add("active");
        const targetContent = this.container.querySelector(`#tab-${tabName}`);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });

    // Form submission
    const profileForm = this.container.querySelector("#profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit(e);
      });
    }

    // Profile KB tag selector
    this.container.querySelectorAll(".profile-kb-tag").forEach((tag) => {
      tag.addEventListener("click", () => this._toggleProfileTag(tag));
    });

    this.container.querySelectorAll("#profileTagSelected .fs-tag-chip-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = String(btn.dataset.id);
        const tagEl = this.container.querySelector(`.profile-kb-tag[data-id="${id}"]`);
        if (tagEl) this._toggleProfileTag(tagEl);
      });
    });

    // Logout
    const logoutLink = this.container.querySelector(".nav-item.logout");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  async handleSubmit(e) {
    const formData = new FormData(e.target);
    
    // Map tahapan KB from form to database values
    const tahapanKBMap = {
      "Pra-KB": "pra_kb",
      "Sedang": "sedang_kb",
      "Pasca": "pasca_kb"
    };
    
    const tahapanKBValue = formData.get("tahapanKB");
    const tahapanKBMapped = tahapanKBMap[tahapanKBValue] || tahapanKBValue;
    
    // Map form data to API structure
    const profileData = {
      // User Profile
      nama_lengkap: formData.get("namaLengkap"),
      nik: formData.get("nik"),
      tempat_lahir: formData.get("tempatLahir"),
      tanggal_lahir: formData.get("tanggalLahir"),
      jenis_kelamin: formData.get("jenisKelamin"),
      no_kk: formData.get("noKK"),
      no_hp: formData.get("noHp"),
      alamat: formData.get("alamat"),
      kecamatan: formData.get("kecamatan"),
      jenis_akseptor: formData.get("jenisAkseptor"),
      
      // Pasangan KB
      nama_pasangan: formData.get("namaSuami"),
      nik_pasangan: formData.get("nikPasangan"),
      pendidikan: formData.get("pendidikanSuami"),
      pekerjaan: formData.get("pekerjaanSuami"),
      jumlah_anak_laki: parseInt(formData.get("anakLaki")) || 0,
      jumlah_anak_perempuan: parseInt(formData.get("anakPerempuan")) || 0,
      usia_anak_terakhir: parseInt(formData.get("usiaAnakTerkecil")) || null,
      tahapan_kb: tahapanKBMapped,
      status_pernikahan: formData.get("statusPernikahan"),
      
      // Asuransi
      jenis_asuransi: formData.get("asuransi"),
      no_bpjs: formData.get("noBPJS"),
      jenis_kepesertaan: formData.get("jenisKepesertaan"),
      faskes_tk1: formData.get("faskes"),
      
      // Riwayat Reproduksi
      penyakit_kuning: formData.get("sakitKuning") === "ya",
      keputihan: formData.get("keputihan") === "ya",
      tumor_ginekologi: formData.get("tumor") === "Ada",
      pms: formData.get("penyakitMenular") === "Ada",
      gravida: parseInt(formData.get("gravida")) || 0,
      partus: parseInt(formData.get("partus")) || 0,
      abortus: parseInt(formData.get("abortus")) || 0,
      hidup: (parseInt(formData.get("anakLaki")) || 0) + (parseInt(formData.get("anakPerempuan")) || 0),
      // User preference
      kontrasepsi_yang_diinginkan: formData.get("kontrasepsiDiinginkan") || null,
    };

    try {
      const result = await this.model.updateProfile(profileData);
      
      if (result.success) {
        alert("Profil berhasil diperbarui!");
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.nama_lengkap = profileData.nama_lengkap;
        storedUser.no_hp = profileData.no_hp;
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        // Reload data
        await this.loadData();
        this.render();
        this.attachEventListeners();
      } else {
        alert(result.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
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
      authService.logout();
    }
  }
}
