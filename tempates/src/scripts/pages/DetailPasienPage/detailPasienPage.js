import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

function formatDate(val) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function infoRow(label, value) {
  return `<div class="fs-info-row"><span>${label}</span><span>${value || "-"}</span></div>`;
}

function statusBadge(status) {
  const map = {
    baru:      ["dp-badge-baru",      "Baru"],
    ulangan:   ["dp-badge-ulangan",   "Ulangan"],
    cabut:     ["dp-badge-cabut",     "Cabut"],
    ganti:     ["dp-badge-ganti",     "Ganti"],
    konseling: ["dp-badge-konseling", "Konseling"],
  };
  const [cls, label] = map[status] || ["dp-badge-konseling", status || "-"];
  return `<span class="dp-badge ${cls}">${label}</span>`;
}

function historyCards(history) {
  if (!history || history.length === 0) {
    return `<p class="dp-no-data">Belum ada riwayat pelayanan.</p>`;
  }

  return history.map((h, i) => `
    <div class="dp-history-card">
      <button type="button" class="history-toggle" data-index="${i}" aria-expanded="false">
        <div class="dp-toggle-left">
          ${statusBadge(h.status_pelayanan)}
          <span class="dp-toggle-date">${formatDate(h.tanggal_datang)}</span>
          <span class="dp-toggle-kontrasepsi">${h.kontrasepsi_nama}</span>
        </div>
        <svg class="dp-toggle-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      <div class="dp-history-body" id="history-body-${i}" hidden>
        <div class="fs-info-grid">
          <div class="fs-info-col">
            <h4 class="fs-info-subtitle">Pelayanan</h4>
            ${infoRow("Tanggal Datang", formatDate(h.tanggal_datang))}
            ${infoRow("Tanggal Pelayanan", formatDate(h.tanggal_pelayanan))}
            ${infoRow("Kontrasepsi", h.kontrasepsi_nama)}
            ${infoRow("Tanggal Pasang", formatDate(h.tanggal_pasang))}
            ${infoRow("Jadwal Kembali", formatDate(h.tanggal_jadwal_kembali))}
            ${infoRow("Tanggal Pencabutan", formatDate(h.tanggal_pencabutan))}
            ${h.alasan_pencabutan ? infoRow("Alasan Pencabutan", h.alasan_pencabutan) : ""}
            ${infoRow("Hasil Rujukan", h.hasil_rujukan ? h.hasil_rujukan.replace(/_/g, " ") : "-")}
            ${h.keterangan ? infoRow("Keterangan", h.keterangan) : ""}
          </div>
          <div class="fs-info-divider"></div>
          <div class="fs-info-col">
            <h4 class="fs-info-subtitle">Pemeriksaan Fisik</h4>
            ${infoRow("Tekanan Darah", h.tekanan_darah_sistolik ? `${h.tekanan_darah_sistolik}/${h.tekanan_darah_diastolik} mmHg` : "-")}
            ${infoRow("Detak Nadi", h.detak_nadi ? `${h.detak_nadi} bpm` : "-")}
            ${infoRow("Suhu", h.suhu ? `${h.suhu} °C` : "-")}
            ${infoRow("Tinggi Badan", h.tinggi_badan ? `${h.tinggi_badan} cm` : "-")}
            ${infoRow("Berat Badan", h.berat_badan ? `${h.berat_badan} kg` : "-")}
            ${infoRow("IMT", h.imt || "-")}
            ${infoRow("Lingkar Perut", h.lingkar_perut ? `${h.lingkar_perut} cm` : "-")}
            ${infoRow("Status Umum", h.status_umum || "-")}
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

export default function detailPasienView(user, patient, history) {
  const p = patient || {};
  const jadwal = history && history.length > 0 ? history[0].tanggal_jadwal_kembali : null;

  return `
    ${navbarView(user)}

    <div class="dashboard-container">
      ${sidebarBidanView(user, "pasien")}

      <main class="dashboard-main">
        <div class="dashboard-header">
          <div>
            <a href="#/manajemen-pasien" class="dp-back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Kembali ke Manajemen Pasien
            </a>
            <h1 class="dashboard-title">Detail Pasien</h1>
          </div>
        </div>

        <!-- Informasi Pribadi -->
        <div class="fs-card">
          <div class="fs-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Informasi Pribadi
          </div>
          <div class="fs-info-grid">
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Data Diri</h4>
              ${infoRow("Nama Lengkap", p.nama_lengkap)}
              ${infoRow("NIK", p.nik)}
              ${infoRow("No. KK", p.no_kk)}
              ${infoRow("Jenis Kelamin", p.jenis_kelamin)}
              ${infoRow("Tempat Lahir", p.tempat_lahir)}
              ${infoRow("Tanggal Lahir", formatDate(p.tanggal_lahir))}
              ${infoRow("No. HP", p.no_hp)}
              ${infoRow("Alamat", p.alamat ? `${p.alamat}, Kec. ${p.kecamatan || ""}` : "-")}
            </div>
            <div class="fs-info-divider"></div>
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Data Pasangan & KB</h4>
              ${infoRow("Nama Pasangan", p.nama_pasangan)}
              ${infoRow("NIK Pasangan", p.nik_pasangan)}
              ${infoRow("Status Pernikahan", p.status_pernikahan)}
              ${infoRow("Pekerjaan", p.pekerjaan)}
              ${infoRow("Pendidikan", p.pendidikan)}
              ${infoRow("Jumlah Anak Laki-laki", p.jumlah_anak_laki)}
              ${infoRow("Jumlah Anak Perempuan", p.jumlah_anak_perempuan)}
              ${infoRow("Tahapan KB", p.tahapan_kb ? p.tahapan_kb.replace(/_/g, " ") : "-")}
            </div>
          </div>
        </div>

        <!-- Asuransi & Riwayat Reproduksi -->
        <div class="fs-card">
          <div class="fs-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Asuransi & Riwayat Reproduksi
          </div>
          <div class="fs-info-grid">
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Asuransi</h4>
              ${infoRow("Jenis Asuransi", p.jenis_asuransi)}
              ${infoRow("No. BPJS", p.no_bpjs)}
              ${infoRow("Jenis Kepesertaan", p.jenis_kepesertaan)}
              ${infoRow("Faskes Tingkat 1", p.faskes_tk1)}
            </div>
            <div class="fs-info-divider"></div>
            <div class="fs-info-col">
              <h4 class="fs-info-subtitle">Riwayat Reproduksi</h4>
              ${infoRow("Gravida", p.gravida)}
              ${infoRow("Partus", p.partus)}
              ${infoRow("Abortus", p.abortus)}
              ${infoRow("Hidup", p.hidup)}
            </div>
          </div>
        </div>

        <!-- Jadwal Datang Kembali -->
        ${jadwal ? `
        <div class="fs-card dp-jadwal-card">
          <div class="fs-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Jadwal Datang Kembali
          </div>
          <p class="dp-jadwal-date">${formatDate(jadwal)}</p>
        </div>
        ` : ""}

        <!-- Riwayat Pelayanan -->
        <div class="fs-card">
          <div class="fs-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#51CBFF" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Riwayat Pelayanan
          </div>
          <div id="history-list">
            ${historyCards(history)}
          </div>
        </div>

      </main>
    </div>
  `;
}
