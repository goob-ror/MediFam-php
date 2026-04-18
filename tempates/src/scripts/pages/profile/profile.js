import navbarView from "../../components/navbar";
import dashboardSidebar from "../../components/dashboard-sidebar";

export default function profileView(user, profileData, kontrasepsiList) {
  const preferenceIds = (profileData.kontrasepsi_yang_diinginkan || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const kontrasepsiTags = (kontrasepsiList || []).map((k) => `
    <button type="button" class="fs-tag profile-kb-tag ${preferenceIds.includes(String(k.id)) ? "selected" : ""}"
      data-id="${k.id}" data-nama="${k.nama}">
      ${k.nama}
    </button>
  `).join("");

  const selectedChips = preferenceIds.length
    ? (kontrasepsiList || [])
        .filter((k) => preferenceIds.includes(String(k.id)))
        .map((k) => `
          <span class="fs-tag-chip">
            ${k.nama}
            <button type="button" class="fs-tag-chip-remove" data-id="${k.id}">×</button>
          </span>
        `).join("")
    : `<span class="fs-tag-placeholder">Pilih preferensi kontrasepsi...</span>`;
  return `
    ${navbarView(user)}

    <div class="dashboard-layout">
      ${dashboardSidebar(user, 'profile')}

      <main class="dashboard-main">
        <div class="profile-header">
          <h1 class="profile-title">Profile Ku</h1>
          ${!profileData.isComplete ? `
          <div class="profile-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <strong>Profile Anda Belum Lengkap!</strong>
              <p>Mohon melengkapi bagian yang diberi tanda <span style="color: red;">*</span></p>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Tabs -->
        <div class="profile-tabs">
          <button class="tab-button active" data-tab="pribadi">Informasi Pribadi</button>
          <button class="tab-button" data-tab="asuransi">Asuransi</button>
          <button class="tab-button" data-tab="keluarga">Pasangan & Keluarga</button>
        </div>

        <form class="profile-form" id="profileForm">
          <!-- Tab 1: Informasi Pribadi -->
          <div class="tab-content active" id="tab-pribadi">
            <div class="form-section">
              <h2 class="section-title">Informasi Pribadi <span class="required">*</span></h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="namaLengkap" class="form-label">Nama Lengkap</label>
                  <input type="text" id="namaLengkap" name="namaLengkap" class="form-input" 
                    value="${profileData.nama_lengkap || ''}" placeholder="Jane Doe" required />
                </div>

                <div class="form-group">
                  <label for="nik" class="form-label">Nomor Induk Kependudukan</label>
                  <input type="text" id="nik" name="nik" class="form-input" maxlength="16"
                    value="${profileData.nik || ''}" placeholder="6472012345678910" required />
                </div>

                <div class="form-group">
                  <label for="tempatLahir" class="form-label">Tempat, Tanggal Lahir</label>
                  <input type="text" id="tempatLahir" name="tempatLahir" class="form-input"
                    value="${profileData.tempat_lahir || ''}" placeholder="Palaran" />
                </div>

                <div class="form-group">
                  <label for="tanggalLahir" class="form-label">&nbsp;</label>
                  <input type="date" id="tanggalLahir" name="tanggalLahir" class="form-input"
                    value="${profileData.tanggal_lahir || ''}" />
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Jenis Kelamin</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" name="jenisKelamin" value="L" ${profileData.jenis_kelamin === 'L' ? 'checked' : ''} />
                      <span>Laki-laki</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="jenisKelamin" value="P" ${profileData.jenis_kelamin === 'P' ? 'checked' : ''} />
                      <span>Perempuan</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h2 class="section-title">Informasi Kontak <span class="required">*</span></h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="noKK" class="form-label">Nama KK</label>
                  <input type="text" id="noKK" name="noKK" class="form-input"
                    value="${profileData.no_kk || ''}" placeholder="John Doe" />
                </div>

                <div class="form-group">
                  <label for="noHp" class="form-label">Nomor Handphone</label>
                  <input type="tel" id="noHp" name="noHp" class="form-input"
                    value="${profileData.no_hp || ''}" placeholder="081234567890" required />
                </div>

                <div class="form-group full-width">
                  <label for="alamat" class="form-label">Alamat Tinggal</label>
                  <textarea id="alamat" name="alamat" class="form-textarea" rows="2" 
                    placeholder="Gg. Cemp. L Rw. Makmur, Kec. Palaran, Kota Samarinda, Kalimantan Timur 75251">${profileData.alamat || ''}</textarea>
                </div>

                <div class="form-group">
                  <label for="kecamatan" class="form-label">Kecamatan</label>
                  <select id="kecamatan" name="kecamatan" class="form-select">
                    <option value="">Pilih Kecamatan</option>
                    <option value="Rawa Makmur" ${profileData.kecamatan === 'Rawa Makmur' ? 'selected' : ''}>Rawa Makmur</option>
                    <option value="Simpang Pasir" ${profileData.kecamatan === 'Simpang Pasir' ? 'selected' : ''}>Simpang Pasir</option>
                    <option value="Handil Bakti" ${profileData.kecamatan === 'Handil Bakti' ? 'selected' : ''}>Handil Bakti</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="jenisAkseptor" class="form-label">Jenis Akseptor</label>
                  <select id="jenisAkseptor" name="jenisAkseptor" class="form-select">
                    <option value="">Pilih Jenis Akseptor</option>
                    <option value="Baru" ${profileData.jenis_akseptor === 'Baru' ? 'selected' : ''}>Baru</option>
                    <option value="Aktif" ${profileData.jenis_akseptor === 'Aktif' ? 'selected' : ''}>Aktif</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Preferensi Kontrasepsi</label>
                  <div class="fs-tag-selector" id="profileTagSelector">
                    <div class="fs-tag-selected" id="profileTagSelected">
                      ${selectedChips}
                    </div>
                    <div class="fs-tag-options">
                      ${kontrasepsiTags}
                    </div>
                  </div>
                  <div class="kb-keterangan-toast" id="kbKeteranganToast" style="display:none;"></div>
                  <input type="hidden" id="kontrasepsiDiinginkan" name="kontrasepsiDiinginkan" value="${profileData.kontrasepsi_yang_diinginkan || ''}">
                  <small class="form-hint">Pilih kontrasepsi yang Anda inginkan. Bidan akan melihat preferensi ini saat pelayanan.</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Asuransi dan Kepesertaan -->
          <div class="tab-content" id="tab-asuransi">
            <div class="form-section">
              <h2 class="section-title">Asuransi dan Kepesertaan <span class="required">*</span></h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="asuransi" class="form-label">Asuransi</label>
                  <select id="asuransi" name="asuransi" class="form-select">
                    <option value="">Pilih Asuransi</option>
                    <option value="BPJS" ${profileData.asuransi === 'BPJS' ? 'selected' : ''}>BPJS</option>
                    <option value="Umum" ${profileData.asuransi === 'Umum' ? 'selected' : ''}>Umum</option>
                    <option value="Lainnya" ${profileData.asuransi === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="noBPJS" class="form-label">Nomor BPJS</label>
                  <input type="text" id="noBPJS" name="noBPJS" class="form-input" maxlength="20"
                    value="${profileData.no_bpjs || ''}" placeholder="0001234567890" />
                </div>

                <div class="form-group">
                  <label for="jenisKepesertaan" class="form-label">Jenis Kepesertaan</label>
                  <select id="jenisKepesertaan" name="jenisKepesertaan" class="form-select">
                    <option value="">Pilih Jenis</option>
                    <option value="PBI" ${profileData.jenis_kepesertaan === 'PBI' ? 'selected' : ''}>PBI</option>
                    <option value="Non PBI" ${profileData.jenis_kepesertaan === 'Non PBI' ? 'selected' : ''}>Non PBI</option>
                    <option value="PBPU" ${profileData.jenis_kepesertaan === 'PBPU' ? 'selected' : ''}>PBPU</option>
                    <option value="PPU" ${profileData.jenis_kepesertaan === 'PPU' ? 'selected' : ''}>PPU</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label for="faskes" class="form-label">Nama Fasilitas Kesehatan</label>
                  <input type="text" id="faskes" name="faskes" class="form-input"
                    value="${profileData.faskes || ''}" placeholder="Puskesmas Palaran" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h2 class="section-title">Riwayat Reproduksi</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Sakit Kuning</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" name="sakitKuning" value="tidak" ${profileData.sakit_kuning === 'tidak' ? 'checked' : ''} />
                      <span>Tidak</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="sakitKuning" value="ya" ${profileData.sakit_kuning === 'ya' ? 'checked' : ''} />
                      <span>Ya</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Keputihan</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" name="keputihan" value="tidak" ${profileData.keputihan === 'tidak' ? 'checked' : ''} />
                      <span>Tidak</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="keputihan" value="ya" ${profileData.keputihan === 'ya' ? 'checked' : ''} />
                      <span>Ya</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="tumor" class="form-label">Tumor</label>
                  <select id="tumor" name="tumor" class="form-select">
                    <option value="Tidak Ada" ${profileData.tumor === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                    <option value="Ada" ${profileData.tumor === 'Ada' ? 'selected' : ''}>Ada</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="penyakitMenular" class="form-label">Penyakit Menular</label>
                  <select id="penyakitMenular" name="penyakitMenular" class="form-select">
                    <option value="Tidak Ada" ${profileData.penyakit_menular === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                    <option value="Ada" ${profileData.penyakit_menular === 'Ada' ? 'selected' : ''}>Ada</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">GPA (Gravida, Partus, Abortus)</label>
                  <div class="gpa-group">
                    <input type="number" name="gravida" class="form-input-small" min="0" 
                      value="${profileData.gravida || 0}" placeholder="0" />
                    <input type="number" name="partus" class="form-input-small" min="0" 
                      value="${profileData.partus || 0}" placeholder="0" />
                    <input type="number" name="abortus" class="form-input-small" min="0" 
                      value="${profileData.abortus || 0}" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Data Pasangan & Keluarga -->
          <div class="tab-content" id="tab-keluarga">
            <div class="form-section">
              <h2 class="section-title">Data Pasangan & Keluarga</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="namaSuami" class="form-label">Nama Suami/Istri</label>
                  <input type="text" id="namaSuami" name="namaSuami" class="form-input"
                    value="${profileData.nama_suami || ''}" placeholder="John Doe" />
                </div>

                <div class="form-group">
                  <label for="nikPasangan" class="form-label">NIK Suami/Istri</label>
                  <input type="text" id="nikPasangan" name="nikPasangan" class="form-input" maxlength="16"
                    value="${profileData.nik_pasangan || ''}" placeholder="6472010101881234" />
                </div>

                <div class="form-group">
                  <label for="pendidikanSuami" class="form-label">Pendidikan Suami/Istri</label>
                  <select id="pendidikanSuami" name="pendidikanSuami" class="form-select">
                    <option value="">Pilih Pendidikan</option>
                    <option value="SD" ${profileData.pendidikan_suami === 'SD' ? 'selected' : ''}>SD</option>
                    <option value="SMP" ${profileData.pendidikan_suami === 'SMP' ? 'selected' : ''}>SMP</option>
                    <option value="SMA" ${profileData.pendidikan_suami === 'SMA' ? 'selected' : ''}>SMA</option>
                    <option value="D3" ${profileData.pendidikan_suami === 'D3' ? 'selected' : ''}>D3</option>
                    <option value="S1" ${profileData.pendidikan_suami === 'S1' ? 'selected' : ''}>S1</option>
                    <option value="S2" ${profileData.pendidikan_suami === 'S2' ? 'selected' : ''}>S2</option>
                    <option value="S3" ${profileData.pendidikan_suami === 'S3' ? 'selected' : ''}>S3</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="pekerjaanSuami" class="form-label">Pekerjaan Suami/Istri</label>
                  <select id="pekerjaanSuami" name="pekerjaanSuami" class="form-select">
                    <option value="">Pilih Pekerjaan</option>
                    <option value="PNS" ${profileData.pekerjaan_suami === 'PNS' ? 'selected' : ''}>PNS</option>
                    <option value="Swasta" ${profileData.pekerjaan_suami === 'Swasta' ? 'selected' : ''}>Swasta</option>
                    <option value="Wiraswasta" ${profileData.pekerjaan_suami === 'Wiraswasta' ? 'selected' : ''}>Wiraswasta</option>
                    <option value="Pegawai" ${profileData.pekerjaan_suami === 'Pegawai' ? 'selected' : ''}>Pegawai</option>
                    <option value="Lainnya" ${profileData.pekerjaan_suami === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Jumlah Anak Hidup</label>
                  <div class="children-group">
                    <div class="child-input">
                      <label class="child-label">Laki-laki</label>
                      <input type="number" name="anakLaki" class="form-input-small" min="0" 
                        value="${profileData.anak_laki || 0}" />
                    </div>
                    <div class="child-input">
                      <label class="child-label">Perempuan</label>
                      <input type="number" name="anakPerempuan" class="form-input-small" min="0" 
                        value="${profileData.anak_perempuan || 0}" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="usiaAnakTerkecil" class="form-label">Usia Anak Terkecil</label>
                  <input type="number" id="usiaAnakTerkecil" name="usiaAnakTerkecil" class="form-input" min="0"
                    value="${profileData.usia_anak_terkecil || ''}" placeholder="1" />
                </div>

                <div class="form-group">
                  <label for="statusPernikahan" class="form-label">Status Pernikahan</label>
                  <select id="statusPernikahan" name="statusPernikahan" class="form-select">
                    <option value="">Pilih Status</option>
                    <option value="menikah" ${profileData.status_pernikahan === 'menikah' ? 'selected' : ''}>Menikah</option>
                    <option value="janda_duda" ${profileData.status_pernikahan === 'janda_duda' ? 'selected' : ''}>Janda/Duda</option>
                    <option value="cerai" ${profileData.status_pernikahan === 'cerai' ? 'selected' : ''}>Cerai</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Tahapan KB</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" name="tahapanKB" value="Pra-KB" ${profileData.tahapan_kb === 'Pra-KB' ? 'checked' : ''} />
                      <span>Pra-KB</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="tahapanKB" value="Sedang" ${profileData.tahapan_kb === 'Sedang' ? 'checked' : ''} />
                      <span>Sedang</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="tahapanKB" value="Pasca" ${profileData.tahapan_kb === 'Pasca' ? 'checked' : ''} />
                      <span>Pasca</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="caraKB" class="form-label">Cara KB Terakhir</label>
                  <select id="caraKB" name="caraKB" class="form-select">
                    <option value="">Pilih Cara KB</option>
                    <option value="Tidak Ada" ${profileData.cara_kb === 'Tidak Ada' ? 'selected' : ''}>Tidak Ada</option>
                    <option value="Pil" ${profileData.cara_kb === 'Pil' ? 'selected' : ''}>Pil</option>
                    <option value="Suntik" ${profileData.cara_kb === 'Suntik' ? 'selected' : ''}>Suntik</option>
                    <option value="IUD" ${profileData.cara_kb === 'IUD' ? 'selected' : ''}>IUD</option>
                    <option value="Implant" ${profileData.cara_kb === 'Implant' ? 'selected' : ''}>Implant</option>
                    <option value="Kondom" ${profileData.cara_kb === 'Kondom' ? 'selected' : ''}>Kondom</option>
                    <option value="Lainnya" ${profileData.cara_kb === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Simpan Data</button>
          </div>
        </form>
      </main>
    </div>
  `;
}
