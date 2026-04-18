import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

export default function formSessionView(user, patient, kontrasepsiList) {
  const p = patient || {};
  const up = p.user_profile || {};
  const asuransi = p.asuransi || {};
  const rr = p.riwayat_reproduksi || {};

  function age(dob) {
    if (!dob) return "-";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  function formatDate(d) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  }

  // Build a lookup map id -> nama for kontrasepsiList
  const kontrasepsiMap = {};
  (kontrasepsiList || []).forEach((k) => { kontrasepsiMap[String(k.id)] = k.nama; });

  // Parse user's preference IDs e.g. "1, 3, 5"
  const preferenceIds = (p.kontrasepsi_yang_diinginkan || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const preferenceNames = preferenceIds
    .map((id) => kontrasepsiMap[id] || id)
    .filter(Boolean);

  const preferenceHTML = preferenceNames.length
    ? preferenceNames.map((n) => `<span class="fs-pref-chip">${n}</span>`).join("")
    : `<span class="fs-pref-none">Belum diisi</span>`;

  const kontrasepsiTags = (kontrasepsiList || []).map((k) => `
    <button type="button" class="fs-tag" data-id="${k.id}" data-nama="${k.nama}">
      ${k.nama}
    </button>
  `).join("");

  return `
    ${navbarView(user)}

    <div class="dashboard-container">
      ${sidebarBidanView(user, "pendaftar")}

      <main class="dashboard-main">
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Form Pelayanan KB</h1>
            <p class="dashboard-subtitle">Isi data pemeriksaan dan pelayanan kontrasepsi</p>
          </div>
        </div>

        <!-- Informasi Pasien -->
        <div class="fs-card">
          <div class="fs-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Informasi Pasien
          </div>
          <div class="fs-info-grid">
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Informasi Pribadi</h4>
              <div class="fs-info-row"><span>NIK</span><span>${up.nik || "-"}</span></div>
              <div class="fs-info-row"><span>Nama</span><span>${up.nama_lengkap || "-"}</span></div>
              <div class="fs-info-row"><span>Akseptor</span><span>${p.akseptor || "Baru"}</span></div>
              <div class="fs-info-row"><span>TTL [Usia]</span><span>${up.tempat_lahir || "-"}, ${formatDate(up.tanggal_lahir)} (${age(up.tanggal_lahir)} Tahun)</span></div>
              <div class="fs-info-row"><span>Jenis Kelamin</span><span>${up.jenis_kelamin === "P" ? "Perempuan" : up.jenis_kelamin === "L" ? "Laki-laki" : "-"}</span></div>
              <div class="fs-info-row"><span>Nomor HP</span><span>${up.no_hp || "-"}</span></div>
              <div class="fs-info-row"><span>Alamat</span><span>${up.alamat ? `${up.alamat}, Kec. ${up.kecamatan || ""}` : "-"}</span></div>
            </div>
            <div class="fs-info-divider"></div>
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Informasi Asuransi</h4>
              <div class="fs-info-row"><span>Asuransi</span><span>${asuransi.jenis_asuransi || "-"}</span></div>
              <div class="fs-info-row"><span>Jenis Kepesertaan</span><span>${asuransi.jenis_kepesertaan || "-"}</span></div>
              <div class="fs-info-row"><span>Nama Faskes</span><span>${asuransi.faskes_tk1 || "-"}</span></div>
              <div class="fs-info-row fs-pref-row">
                <span>Preferensi KB</span>
                <div class="fs-pref-chips">${preferenceHTML}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="fs-tabs">
          <button class="fs-tab active" data-tab="pemeriksaan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Pemeriksaan Fisik
          </button>
          <button class="fs-tab" data-tab="riwayat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Riwayat Reproduksi
          </button>
          <button class="fs-tab" data-tab="pelayanan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Data Pelayanan
          </button>
        </div>

        <form id="formPelayanan">

          <!-- Tab 1: Pemeriksaan Fisik -->
          <div class="fs-tab-panel active" id="tab-pemeriksaan">
            <div class="fs-card">
              <div class="fs-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Pemeriksaan Fisik dan Vital Sign
              </div>
              <div class="fs-form-grid">
                <div class="fs-field-group">
                  <label>Tekanan Darah</label>
                  <div class="fs-inline">
                    <input type="number" id="td_sistolik" class="fs-input" placeholder="120" min="0" max="300">
                    <span class="fs-sep">/</span>
                    <input type="number" id="td_diastolik" class="fs-input" placeholder="80" min="0" max="200">
                    <span class="fs-unit">mmHg</span>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Detak Nadi</label>
                  <div class="fs-input-unit">
                    <input type="number" id="detak_nadi" class="fs-input" placeholder="90" min="0" max="300">
                    <span class="fs-unit-badge">per Menit</span>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Nafas</label>
                  <div class="fs-input-unit">
                    <input type="number" id="respirasi" class="fs-input" placeholder="20" min="0" max="100">
                    <span class="fs-unit-badge">per Menit</span>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Suhu Tubuh</label>
                  <div class="fs-input-unit">
                    <input type="number" id="suhu" class="fs-input" placeholder="36.5" step="0.1" min="30" max="45">
                    <span class="fs-unit-badge">°C</span>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Tinggi Badan</label>
                  <div class="fs-input-unit">
                    <input type="number" id="tinggi_badan" class="fs-input" placeholder="160" min="0" max="250">
                    <span class="fs-unit-badge">cm</span>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Berat Badan</label>
                  <div class="fs-input-unit">
                    <input type="number" id="berat_badan" class="fs-input" placeholder="55" step="0.1" min="0" max="300">
                    <span class="fs-unit-badge">kg</span>
                  </div>
                </div>

                <div class="fs-field-group fs-imt-field">
                  <label>Indeks Massa Tubuh</label>
                  <div class="fs-imt-display">
                    <span id="imtValue">-</span>
                    <small>kg/m²</small>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Lingkar Perut</label>
                  <div class="fs-input-unit">
                    <input type="number" id="lingkar_perut" class="fs-input" placeholder="80" min="0" max="200">
                    <span class="fs-unit-badge">cm</span>
                  </div>
                </div>
              </div>

              <div class="fs-tab-nav">
                <span></span>
                <button type="button" class="fs-btn-next" data-next="riwayat">
                  Selanjutnya
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Tab 2: Riwayat Reproduksi -->
          <div class="fs-tab-panel" id="tab-riwayat">
            <div class="fs-card">
              <div class="fs-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Riwayat Penyakit Reproduksi
              </div>
              <div class="fs-form-grid">

                <div class="fs-field-group">
                  <label>GPA (Gravida, Partus, Abortus)</label>
                  <div class="fs-gpa-row">
                    <div class="fs-gpa-item">
                      <span class="fs-gpa-label">G</span>
                      <input type="number" id="gravida" class="fs-input" placeholder="0" value="${rr.gravida || 0}" min="0">
                    </div>
                    <div class="fs-gpa-item">
                      <span class="fs-gpa-label">P</span>
                      <input type="number" id="partus" class="fs-input" placeholder="0" value="${rr.partus || 0}" min="0">
                    </div>
                    <div class="fs-gpa-item">
                      <span class="fs-gpa-label">A</span>
                      <input type="number" id="abortus" class="fs-input" placeholder="0" value="${rr.abortus || 0}" min="0">
                    </div>
                  </div>
                </div>

                <div class="fs-field-group">
                  <label>Tanggal Haid Terakhir</label>
                  <input type="text" id="tanggal_haid_terakhir" class="fs-input flatpickr-tht" placeholder="Pilih tanggal">
                </div>

                <div class="fs-field-group">
                  <label>Posisi Rahim</label>
                  <select id="posisi_rahim" class="fs-select">
                    <option value="antefleksi">Normal (Antefleksi)</option>
                    <option value="retrofleksi">Retrofleksi</option>
                    <option value="lainnya">Lainnya</option>
                    <option value="tidak_diperiksa">Tidak Diperiksa</option>
                  </select>
                </div>

                <div class="fs-field-group">
                  <label>Pemeriksaan Umum</label>
                  <select id="status_umum" class="fs-select">
                    <option value="baik">Baik</option>
                    <option value="risiko_rendah">Risiko Rendah</option>
                    <option value="risiko_tinggi">Risiko Tinggi</option>
                  </select>
                </div>

                <div class="fs-field-group">
                  <label>Akibat Penggunaan Kontrasepsi Sebelumnya</label>
                  <input type="text" id="efek_samping" class="fs-input" placeholder="Tidak ada">
                </div>

              </div>

              <!-- Radio groups in 2-col grid -->
              <div class="fs-radio-grid">
                <div class="fs-radio-group">
                  <label>Sakit Kuning</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="penyakit_kuning" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="penyakit_kuning" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Keputihan</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="keputihan" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="keputihan" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Hamil / Diduga Hamil</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="hamil" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="hamil" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Menyusui</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="menyusui" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="menyusui" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Tanda Radang</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="tanda_radang" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="tanda_radang" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Tumor / Keganasan Ginekologi</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="tumor_keganasan" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="tumor_keganasan" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Tanda Diabetes</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="tanda_diabetes" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="tanda_diabetes" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Kelainan Pembekuan Darah</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="kelainan_pembekuan" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="kelainan_pembekuan" value="1"> Ya</label>
                  </div>
                </div>
                <div class="fs-radio-group">
                  <label>Radang Orchitis / Epididymitis</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="orchitis_epididymitis" value="0" checked> Tidak</label>
                    <label class="fs-radio"><input type="radio" name="orchitis_epididymitis" value="1"> Ya</label>
                  </div>
                </div>
              </div>

              <div class="fs-tab-nav">
                <button type="button" class="fs-btn-prev" data-prev="pemeriksaan">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Sebelumnya
                </button>
                <button type="button" class="fs-btn-next" data-next="pelayanan">
                  Selanjutnya
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Tab 3: Data Pelayanan -->
          <div class="fs-tab-panel" id="tab-pelayanan">
            <div class="fs-card">
              <div class="fs-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Data Pelayanan dan Tindakan
              </div>
              <div class="fs-form-grid">

                <div class="fs-field-group">
                  <label>Tanggal Datang</label>
                  <input type="text" id="tanggal_datang" class="fs-input flatpickr-date" placeholder="Pilih tanggal">
                </div>

                <div class="fs-field-group">
                  <label>Tanggal Dilayani</label>
                  <input type="text" id="tanggal_pelayanan" class="fs-input flatpickr-date" placeholder="Pilih tanggal">
                </div>

                <div class="fs-field-group">
                  <label>Tanggal Datang Kembali</label>
                  <input type="text" id="tanggal_jadwal_kembali" class="fs-input flatpickr-date" placeholder="Pilih tanggal (opsional)">
                </div>

                <div class="fs-field-group">
                  <label>Tanggal Dicabut</label>
                  <input type="text" id="tanggal_pencabutan" class="fs-input flatpickr-date" placeholder="Pilih tanggal (opsional)">
                </div>

                <div class="fs-field-group full-width">
                  <label>Alat Kontrasepsi Yang Boleh Digunakan</label>
                  <div class="fs-tag-selector" id="tagSelector">
                    <div class="fs-tag-selected" id="tagSelected">
                      <span class="fs-tag-placeholder">Pilih kontrasepsi...</span>
                    </div>
                    <div class="fs-tag-options">
                      ${kontrasepsiTags}
                    </div>
                  </div>
                  <input type="hidden" id="kontrasepsi_dipilih" value="">
                  <small class="fs-hint">
                    Klik untuk memilih, klik lagi untuk membatalkan.
                    ${preferenceNames.length ? `<span class="fs-hint-pref">★ = preferensi pasien</span>` : ""}
                  </small>
                </div>

                <div class="fs-field-group full-width">
                  <label>Hasil Keputusan Akhir</label>
                  <div class="fs-radio-row">
                    <label class="fs-radio"><input type="radio" name="hasil_rujukan" value="tidak_dirujuk" checked> Tidak Ada</label>
                    <label class="fs-radio"><input type="radio" name="hasil_rujukan" value="dirujuk_dokter"> Vasektomi</label>
                    <label class="fs-radio"><input type="radio" name="hasil_rujukan" value="dirujuk_rs"> Rujukan RS</label>
                  </div>
                </div>

                <div class="fs-field-group full-width">
                  <label>Catatan Bidan</label>
                  <textarea id="keterangan" class="fs-textarea" placeholder="Tidak ada catatan bidan" rows="3"></textarea>
                </div>

              </div>

              <div class="fs-tab-nav">
                <button type="button" class="fs-btn-prev" data-prev="riwayat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Sebelumnya
                </button>
                <button type="submit" class="fs-btn-submit" id="btnSubmit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Simpan Data
                </button>
              </div>
            </div>
          </div>

        </form>
      </main>
    </div>
  `;
}
