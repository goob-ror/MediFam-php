import formSessionView from "./formSession";
import FormSessionModel from "./formSession-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";

export default class FormSessionPresenter {
  constructor({ container }) {
    this.container = container;
    this.model = new FormSessionModel();
    this.patient = null;
    this.kontrasepsiList = [];
    this.selectedKontrasepsi = []; // array of { id, nama }
    this.pasanganKbId = this._getIdFromHash();
    this.pesertaId = this._getPesertaIdFromHash();
    this.isViewMode = this._getModeFromHash() === "view";
    this.existingSession = null; // holds existing pelayanan/pemeriksaan data
  }

  _getIdFromHash() {
    const match = window.location.hash.match(/[?&]id=(\d+)/);
    return match ? match[1] : null;
  }

  _getPesertaIdFromHash() {
    const match = window.location.hash.match(/[?&]peserta_id=(\d+)/);
    return match ? match[1] : null;
  }

  _getModeFromHash() {
    const match = window.location.hash.match(/[?&]mode=([^&]+)/);
    return match ? match[1] : null;
  }

  async init() {
    if (!authService.isAuthenticated()) {
      window.location.hash = "#/login";
      return;
    }

    const authCheck = await authService.checkAuth();
    if (!authCheck.success) {
      authService.logout();
      return;
    }

    const user = authService.getUser();
    if (!user || user.role !== "bidan") {
      window.location.hash = "#/dashboard-bidan";
      return;
    }

    if (!this.pasanganKbId) {
      Swal.fire({ icon: "error", title: "Error", text: "ID pasien tidak ditemukan", confirmButtonColor: "#51CBFF" });
      window.location.hash = "#/manajemen-pendaftar";
      return;
    }

    this.user = {
      name: user.nama_lengkap || user.username || "Bidan",
      avatar: "/public/image/userAvatar-Female.png",
      joinDate: new Date(user.created_at || Date.now()).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
      }),
      role: user.role,
    };

    await this.loadData();
    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      const [patientRes, kontrasepsiRes] = await Promise.all([
        this.model.getPatientByPasanganId(this.pasanganKbId),
        this.model.getKontrasepsiList(),
      ]);

      if (patientRes.success) {
        this.patient = patientRes.data.patient;
      } else {
        throw new Error(patientRes.message || "Gagal memuat data pasien");
      }

      if (kontrasepsiRes.success) {
        this.kontrasepsiList = kontrasepsiRes.data.kontrasepsi || [];
      }

      // In view/edit mode, load existing session data for prefill
      if (this.isViewMode) {
        const sessionRes = await this.model.getExistingSession(this.pasanganKbId);
        if (sessionRes.success) {
          this.existingSession = sessionRes.data.session || null;
        }
      }
    } catch (error) {
      console.error("Load data error:", error);
      Swal.fire({ icon: "error", title: "Gagal Memuat Data", text: error.message, confirmButtonColor: "#51CBFF" });
    }
  }

  render() {
    this.container.innerHTML = formSessionView(this.user, this.patient, this.kontrasepsiList);
  }

  attachEventListeners() {
    // Navbar
    const navbarPresenter = new NavbarPresenter(this.container);
    navbarPresenter.attachEventListeners();

    const logoutBtn = this.container.querySelector(".nav-item.logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        authService.logout();
      });
    }

    // ── Tabs ──────────────────────────────────────────────
    this.container.querySelectorAll(".fs-tab").forEach((tab) => {
      tab.addEventListener("click", () => this._switchTab(tab.dataset.tab));
    });

    this.container.querySelectorAll(".fs-btn-next").forEach((btn) => {
      btn.addEventListener("click", () => this._switchTab(btn.dataset.next));
    });

    this.container.querySelectorAll(".fs-btn-prev").forEach((btn) => {
      btn.addEventListener("click", () => this._switchTab(btn.dataset.prev));
    });

    // ── Flatpickr ─────────────────────────────────────────
    // Date fields in pelayanan tab
    this.container.querySelectorAll(".flatpickr-date").forEach((el) => {
      flatpickr(el, {
        locale: Indonesian,
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
      });
    });

    // Tanggal haid terakhir (date only, no future)
    const thtEl = this.container.querySelector(".flatpickr-tht");
    if (thtEl) {
      flatpickr(thtEl, {
        locale: Indonesian,
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
        maxDate: "today",
      });
    }

    // ── IMT auto-calculate ────────────────────────────────
    const tinggiInput = this.container.querySelector("#tinggi_badan");
    const beratInput = this.container.querySelector("#berat_badan");
    const imtDisplay = this.container.querySelector("#imtValue");

    const calcIMT = () => {
      const h = parseFloat(tinggiInput?.value) / 100;
      const w = parseFloat(beratInput?.value);
      if (h > 0 && w > 0) {
        imtDisplay.textContent = (w / (h * h)).toFixed(1);
      } else {
        imtDisplay.textContent = "-";
      }
    };

    tinggiInput?.addEventListener("input", calcIMT);
    beratInput?.addEventListener("input", calcIMT);

    // ── Tag selector ──────────────────────────────────────
    // Mark patient preference tags
    const preferenceIds = (this.patient?.kontrasepsi_yang_diinginkan || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    this.container.querySelectorAll(".fs-tag").forEach((tag) => {
      if (preferenceIds.includes(String(tag.dataset.id))) {
        tag.classList.add("preferred");
        tag.title = "Preferensi pasien";
      }
      tag.addEventListener("click", () => this._toggleTag(tag));
    });

    // ── Form submit ───────────────────────────────────────
    const form = this.container.querySelector("#formPelayanan");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    // ── Prefill existing data if in view/edit mode ────────
    if (this.isViewMode && this.existingSession) {
      this._prefillForm(this.existingSession);
    }

    // ── Update submit button label in view mode ───────────
    if (this.isViewMode) {
      const btnSubmit = this.container.querySelector("#btnSubmit");
      if (btnSubmit) {
        btnSubmit.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Update Data
        `;
      }
    }
  }

  _switchTab(tabId) {
    // Update tab buttons
    this.container.querySelectorAll(".fs-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === tabId);
    });
    // Update panels
    this.container.querySelectorAll(".fs-tab-panel").forEach((p) => {
      p.classList.toggle("active", p.id === `tab-${tabId}`);
    });
  }

  _toggleTag(tagEl) {
    const id = parseInt(tagEl.dataset.id);
    const nama = tagEl.dataset.nama;
    const idx = this.selectedKontrasepsi.findIndex((k) => k.id === id);

    if (idx === -1) {
      this.selectedKontrasepsi.push({ id, nama });
      tagEl.classList.add("selected");
    } else {
      this.selectedKontrasepsi.splice(idx, 1);
      tagEl.classList.remove("selected");
    }

    this._renderSelectedTags();
  }

  _renderSelectedTags() {
    const container = this.container.querySelector("#tagSelected");
    const hiddenInput = this.container.querySelector("#kontrasepsi_dipilih");
    const preferenceIds = (this.patient?.kontrasepsi_yang_diinginkan || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    if (this.selectedKontrasepsi.length === 0) {
      container.innerHTML = `<span class="fs-tag-placeholder">Pilih kontrasepsi...</span>`;
      hiddenInput.value = "";
    } else {
      container.innerHTML = this.selectedKontrasepsi
        .map((k) => {
          const isMatch = preferenceIds.includes(String(k.id));
          return `
            <span class="fs-tag-chip ${isMatch ? "fs-tag-chip-match" : ""}">
              ${isMatch ? "✓ " : ""}${k.nama}
              <button type="button" class="fs-tag-chip-remove" data-id="${k.id}">×</button>
            </span>
          `;
        })
        .join("");
      hiddenInput.value = this.selectedKontrasepsi.map((k) => k.id).join(", ");

      container.querySelectorAll(".fs-tag-chip-remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = parseInt(btn.dataset.id);
          const tagEl = this.container.querySelector(`.fs-tag[data-id="${id}"]`);
          if (tagEl) this._toggleTag(tagEl);
        });
      });
    }
  }

  _prefillForm(session) {
    const pem = session.pemeriksaan || {};
    const pel = session.pelayanan || {};
    const rr = session.riwayat_reproduksi || {};

    const setVal = (id, val) => {
      const el = this.container.querySelector(`#${id}`);
      if (el && val !== null && val !== undefined) el.value = val;
    };

    const setRadio = (name, val) => {
      const el = this.container.querySelector(`input[name="${name}"][value="${val ? 1 : 0}"]`);
      if (el) el.checked = true;
    };

    // Pemeriksaan
    setVal("td_sistolik", pem.tekanan_darah_sistolik);
    setVal("td_diastolik", pem.tekanan_darah_diastolik);
    setVal("detak_nadi", pem.detak_nadi);
    setVal("respirasi", pem.respirasi);
    setVal("suhu", pem.suhu);
    setVal("tinggi_badan", pem.tinggi_badan);
    setVal("berat_badan", pem.berat_badan);
    setVal("lingkar_perut", pem.lingkar_perut);
    setVal("efek_samping", pem.efek_samping_kb_sebelumnya);
    setVal("posisi_rahim", pem.posisi_rahim);
    setVal("status_umum", pem.status_umum);

    // Trigger IMT recalculation
    const tinggiInput = this.container.querySelector("#tinggi_badan");
    const beratInput = this.container.querySelector("#berat_badan");
    const imtDisplay = this.container.querySelector("#imtValue");
    if (tinggiInput && beratInput && imtDisplay) {
      const h = parseFloat(tinggiInput.value) / 100;
      const w = parseFloat(beratInput.value);
      imtDisplay.textContent = h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : "-";
    }

    // Riwayat reproduksi
    setVal("gravida", rr.gravida);
    setVal("partus", rr.partus);
    setVal("abortus", rr.abortus);
    setRadio("penyakit_kuning", rr.penyakit_kuning);
    setRadio("keputihan", rr.keputihan);
    setRadio("tumor_keganasan", rr.tumor_ginekologi);

    // Pemeriksaan radios
    setRadio("hamil", pem.hamil);
    setRadio("menyusui", pem.menyusui);
    setRadio("tanda_radang", pem.tanda_radang);
    setRadio("tanda_diabetes", pem.tanda_diabetes);
    setRadio("kelainan_pembekuan", pem.kelainan_pembekuan);
    setRadio("orchitis_epididymitis", pem.orchitis_epididymitis);

    // Flatpickr date fields — set via _flatpickr instance
    const setFlatpickr = (selector, val) => {
      if (!val) return;
      const el = this.container.querySelector(selector);
      if (el && el._flatpickr) {
        el._flatpickr.setDate(val, true);
      } else if (el) {
        el.value = val;
      }
    };

    setFlatpickr(".flatpickr-tht", pem.tanggal_haid_terakhir);
    setFlatpickr("#tanggal_datang", pel.tanggal_datang);
    setFlatpickr("#tanggal_pelayanan", pel.tanggal_pelayanan);
    setFlatpickr("#tanggal_jadwal_kembali", pel.tanggal_jadwal_kembali);
    setFlatpickr("#tanggal_pencabutan", pel.tanggal_pencabutan);

    // Pelayanan
    setVal("keterangan", pel.keterangan);
    const hasilRujukan = pel.hasil_rujukan || "tidak_dirujuk";
    const hasilEl = this.container.querySelector(`input[name="hasil_rujukan"][value="${hasilRujukan}"]`);
    if (hasilEl) hasilEl.checked = true;

    // Kontrasepsi tags
    if (pel.kontrasepsi_yang_dipilih) {
      const ids = pel.kontrasepsi_yang_dipilih.split(",").map((s) => s.trim()).filter(Boolean);
      ids.forEach((id) => {
        const tagEl = this.container.querySelector(`.fs-tag[data-id="${id}"]`);
        if (tagEl) this._toggleTag(tagEl);
      });
    }
  }

  _getRadioValue(name) {
    const el = this.container.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value) : 0;
  }

  _getVal(id) {
    return this.container.querySelector(`#${id}`)?.value || null;
  }

  async handleSubmit() {
    const btnSubmit = this.container.querySelector("#btnSubmit");
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="fs-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> ${this.isViewMode ? "Mengupdate..." : "Menyimpan..."}`;

    try {
      const tinggi = parseFloat(this._getVal("tinggi_badan")) || null;
      const berat = parseFloat(this._getVal("berat_badan")) || null;
      const imt = tinggi && berat ? parseFloat((berat / ((tinggi / 100) ** 2)).toFixed(2)) : null;

      // kontrasepsi stored as comma-separated IDs string e.g. "1, 3, 5"
      const kontrasepsiValue = this._getVal("kontrasepsi_dipilih") || null;

      const payload = {
        pemeriksaan: {
          tekanan_darah_sistolik: parseInt(this._getVal("td_sistolik")) || null,
          tekanan_darah_diastolik: parseInt(this._getVal("td_diastolik")) || null,
          detak_nadi: parseInt(this._getVal("detak_nadi")) || null,
          respirasi: parseInt(this._getVal("respirasi")) || null,
          suhu: parseFloat(this._getVal("suhu")) || null,
          tinggi_badan: tinggi,
          berat_badan: berat,
          imt,
          lingkar_perut: parseInt(this._getVal("lingkar_perut")) || null,
          hamil: this._getRadioValue("hamil"),
          diduga_hamil: this._getRadioValue("hamil"),
          menyusui: this._getRadioValue("menyusui"),
          tanda_radang: this._getRadioValue("tanda_radang"),
          tumor_keganasan: this._getRadioValue("tumor_keganasan"),
          tanda_diabetes: this._getRadioValue("tanda_diabetes"),
          kelainan_pembekuan: this._getRadioValue("kelainan_pembekuan"),
          orchitis_epididymitis: this._getRadioValue("orchitis_epididymitis"),
          posisi_rahim: this._getVal("posisi_rahim") || "tidak_diperiksa",
          efek_samping_kb_sebelumnya: this._getVal("efek_samping"),
          tanggal_haid_terakhir: this._getVal("tanggal_haid_terakhir"),
          status_umum: this._getVal("status_umum") || "baik",
        },
        riwayat_reproduksi: {
          gravida: parseInt(this._getVal("gravida")) || 0,
          partus: parseInt(this._getVal("partus")) || 0,
          abortus: parseInt(this._getVal("abortus")) || 0,
          penyakit_kuning: this._getRadioValue("penyakit_kuning"),
          keputihan: this._getRadioValue("keputihan"),
          tumor_ginekologi: this._getRadioValue("tumor_keganasan"),
          pms: 0,
        },
        pelayanan: {
          tanggal_datang: this._getVal("tanggal_datang"),
          tanggal_pelayanan: this._getVal("tanggal_pelayanan"),
          kontrasepsi_yang_dipilih: kontrasepsiValue,
          tanggal_jadwal_kembali: this._getVal("tanggal_jadwal_kembali"),
          tanggal_pencabutan: this._getVal("tanggal_pencabutan"),
          hasil_rujukan: this._getVal("hasil_rujukan") || "tidak_dirujuk",
          keterangan: this._getVal("keterangan"),
        },
      };

      const response = this.isViewMode
        ? await this.model.updateForm(this.pasanganKbId, payload)
        : await this.model.submitForm(this.pasanganKbId, payload);

      if (response.success) {
        if (this.pesertaId) {
          await this.model.markAttendance(this.pesertaId);
        }

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pelayanan berhasil disimpan",
          confirmButtonColor: "#51CBFF",
        });
        window.location.hash = this.pesertaId ? "#/manajemen-pendaftar" : "#/manajemen-pasien";
      } else {
        throw new Error(response.message || "Gagal menyimpan data");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.message, confirmButtonColor: "#51CBFF" });
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        ${this.isViewMode ? "Update Data" : "Simpan Data"}
      `;
    }
  }
}
