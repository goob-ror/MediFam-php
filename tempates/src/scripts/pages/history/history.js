import navbarView from "../../components/navbar";
import dashboardSidebar from "../../components/dashboard-sidebar";

function formatDate(val) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function formatTime(val) {
  if (!val) return "-";
  return val.substring(0, 5) + " WITA";
}

function safariRows(list) {
  if (!list || list.length === 0) return null;
  return list.map((item) => {
    const hadir = item.hadir === 1 || item.hadir === true;
    return `
      <tr>
        <td>${formatDate(item.tanggal_kegiatan)}</td>
        <td>${item.waktu_mulai ? formatTime(item.waktu_mulai) : "-"}</td>
        <td>${item.lokasi || "-"}</td>
        <td>${item.judul_kegiatan || "-"}</td>
        <td>
          <span class="status-badge ${hadir ? "status-completed" : "status-cancelled"}">
            ${hadir ? "HADIR" : "TIDAK HADIR"}
          </span>
        </td>
      </tr>`;
  }).join("");
}

function pelayananRows(list) {
  if (!list || list.length === 0) return null;
  return list.map((item) => {
    const statusMap = {
      baru: ["status-baru", "Baru"],
      ulangan: ["status-completed", "Ulangan"],
      cabut: ["status-cancelled", "Cabut"],
      ganti: ["status-ganti", "Ganti"],
      konseling: ["status-konseling", "Konseling"],
    };
    const [cls, label] = statusMap[item.status_pelayanan] || ["status-konseling", item.status_pelayanan || "-"];
    const kunjunganLabel = item.jenis_kunjungan === "follow_up" ? "Follow Up" : "Kunjungan Baru";
    return `
      <tr>
        <td>${formatDate(item.tanggal_datang)}</td>
        <td>${item.nama_kontrasepsi || (item.kontrasepsi_yang_dipilih ? item.kontrasepsi_yang_dipilih : "-")}</td>
        <td>${formatDate(item.tanggal_jadwal_kembali)}</td>
        <td><span class="history-kunjungan-badge">${kunjunganLabel}</span></td>
        <td><span class="status-badge ${cls}">${label}</span></td>
      </tr>`;
  }).join("");
}

function emptyState(text) {
  return `
    <div class="empty-history">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>
      <p>${text}</p>
    </div>`;
}

export default function historyView(user, safariHistory, pelayananHistory) {
  const safariContent = safariRows(safariHistory);
  const pelayananContent = pelayananRows(pelayananHistory);

  return `
    ${navbarView(user)}

    <div class="dashboard-layout">
      ${dashboardSidebar(user, "history")}

      <main class="dashboard-main">
        <h1 class="dashboard-title">History Sesi Anda</h1>

        <!-- Safari History -->
        <div class="history-section">
          <h2 class="history-section-title">History Sesi SAFARI</h2>
          <div class="table-container">
            ${safariContent ? `
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Lokasi</th>
                    <th>Kegiatan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>${safariContent}</tbody>
              </table>
            ` : emptyState("Belum ada history sesi SAFARI")}
          </div>
        </div>

        <!-- Pelayanan / Routine History -->
        <div class="history-section">
          <h2 class="history-section-title">History Pelayanan KB</h2>
          <div class="table-container">
            ${pelayananContent ? `
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Tanggal Datang</th>
                    <th>Kontrasepsi</th>
                    <th>Jadwal Kembali</th>
                    <th>Jenis Kunjungan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>${pelayananContent}</tbody>
              </table>
            ` : emptyState("Belum ada history pelayanan KB")}
          </div>
        </div>

      </main>
    </div>
  `;
}
