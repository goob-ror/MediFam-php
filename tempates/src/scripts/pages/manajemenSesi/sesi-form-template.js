// Helper function to get status icon SVG
function getStatusIcon(status) {
  const icons = {
    draft: `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
      </svg>
    `,
    terjadwal: `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
        <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>
      </svg>
    `,
    berlangsung: `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
      </svg>
    `,
    selesai: `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
    `,
    dibatalkan: `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg>
    `,
  };
  return icons[status] || icons.terjadwal;
}

export function createSesiFormHTML(sesi = null, isEdit = false) {
  const title = isEdit ? "Edit Sesi Safari KB" : "Tambah Sesi Safari KB Baru";
  const submitText = isEdit ? "Simpan Perubahan" : "Tambah Sesi";

  return `
    <div class="sesi-form-container">
      <div class="form-header">
        <h2 class="form-title">${title}</h2>
        <p class="form-subtitle">Lengkapi informasi kegiatan safari KB di bawah ini</p>
      </div>

      <div class="form-body">
        <!-- Section 1: Informasi Kegiatan -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
            <h3>Informasi Kegiatan</h3>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label for="sesi-judul">
                Judul Kegiatan <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="sesi-judul" 
                class="form-input" 
                placeholder="Contoh: Safari KB Simpang Pasir"
                value="${sesi ? sesi.judul_kegiatan : ""}"
              />
              <small class="form-hint">Berikan nama yang jelas dan deskriptif untuk kegiatan</small>
            </div>

            <div class="form-group">
              <label for="sesi-tanggal">
                Tanggal Kegiatan <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="sesi-tanggal" 
                class="form-input" 
                placeholder="Pilih tanggal"
                value="${sesi ? sesi.tanggal_kegiatan : ""}"
              />
            </div>

            <div class="form-group">
              <label for="sesi-status">
                Status Kegiatan <span class="required">*</span>
              </label>
              <div class="select-wrapper">
                <select id="sesi-status" class="form-input">
                  <option value="draft" ${sesi && sesi.status === "draft" ? "selected" : ""}>Draft</option>
                  <option value="terjadwal" ${!sesi || sesi.status === "terjadwal" ? "selected" : ""}>Terjadwal</option>
                  <option value="berlangsung" ${sesi && sesi.status === "berlangsung" ? "selected" : ""}>Berlangsung</option>
                  <option value="selesai" ${sesi && sesi.status === "selesai" ? "selected" : ""}>Selesai</option>
                  <option value="dibatalkan" ${sesi && sesi.status === "dibatalkan" ? "selected" : ""}>Dibatalkan</option>
                </select>
                <div class="status-icon-display" id="status-icon-display">
                  ${getStatusIcon(sesi ? sesi.status : "terjadwal")}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="sesi-waktu-mulai">
                Waktu Mulai
              </label>
              <input 
                type="text" 
                id="sesi-waktu-mulai" 
                class="form-input" 
                placeholder="09:00"
                value="${sesi && sesi.waktu_mulai ? sesi.waktu_mulai : ""}"
              />
            </div>

            <div class="form-group">
              <label for="sesi-waktu-selesai">
                Waktu Selesai
              </label>
              <input 
                type="text" 
                id="sesi-waktu-selesai" 
                class="form-input" 
                placeholder="12:00"
                value="${sesi && sesi.waktu_selesai ? sesi.waktu_selesai : ""}"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Lokasi -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            <h3>Lokasi Kegiatan</h3>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label for="sesi-lokasi">
                Alamat Lokasi <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="sesi-lokasi" 
                class="form-input" 
                placeholder="Contoh: Balai RW 03 Simpang Pasir"
                value="${sesi ? sesi.lokasi : ""}"
              />
            </div>

            <div class="form-group">
              <label for="sesi-kecamatan">
                Kecamatan
              </label>
              <select 
                id="sesi-kecamatan" 
                class="form-input"
              >
                <option value="">Pilih Kecamatan</option>
                <option value="Rawa Makmur" ${sesi && sesi.kecamatan === "Rawa Makmur" ? "selected" : ""}>Rawa Makmur</option>
                <option value="Simpang Pasir" ${sesi && sesi.kecamatan === "Simpang Pasir" ? "selected" : ""}>Simpang Pasir</option>
                <option value="Handil Bakti" ${sesi && sesi.kecamatan === "Handil Bakti" ? "selected" : ""}>Handil Bakti</option>
              </select>
            </div>

            <div class="form-group">
              <label for="sesi-target">
                Target Peserta
              </label>
              <input 
                type="number" 
                id="sesi-target" 
                class="form-input" 
                placeholder="50" 
                min="0"
                value="${sesi && sesi.target_peserta ? sesi.target_peserta : ""}"
              />
            </div>
          </div>

          <!-- Map Section -->
          <div class="map-section">
            <div class="map-header">
              <label>Koordinat Lokasi (Opsional)</label>
              <button type="button" id="btn-toggle-map" class="btn-toggle-map">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                </svg>
                Pilih Lokasi di Peta
              </button>
            </div>
            <div id="map-container" class="map-container" style="display: none;">
              <div id="map" class="map-canvas"></div>
              <div class="map-info">
                <small>Klik pada peta untuk menandai lokasi kegiatan</small>
              </div>
            </div>
            <input type="hidden" id="sesi-koordinat" value="${sesi && sesi.lokasi_koordinat ? sesi.lokasi_koordinat : ""}" />
            <div id="koordinat-display" class="koordinat-display" style="display: ${sesi && sesi.lokasi_koordinat ? "block" : "none"}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <span id="koordinat-text">${sesi && sesi.lokasi_koordinat ? sesi.lokasi_koordinat : ""}</span>
              <button type="button" id="btn-clear-koordinat" class="btn-clear-koordinat">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <button type="button" id="btn-cancel" class="btn btn-secondary">
          Batal
        </button>
        <button type="button" id="btn-submit" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
          ${submitText}
        </button>
      </div>
    </div>
  `;
}
