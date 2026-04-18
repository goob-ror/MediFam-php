import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

export default function dashboardBidanView(
  user,
  todaySessions,
  rujukanKembali,
  pengingatPasien,
  pasienMendaftar,
  upcomingSessions
) {
  const hasTodaySessions = todaySessions && todaySessions.length > 0;
  const hasPengingat = pengingatPasien && pengingatPasien.length > 0;
  const hasUpcomingSessions = upcomingSessions && upcomingSessions.length > 0;

  const upcomingCount = upcomingSessions ? upcomingSessions.length : 0;
  const totalPatients = rujukanKembali ? rujukanKembali.total : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = today.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kuala_Lumpur",
  });

  // Format date range for rujukan kembali subtitle
  function fmtDate(d) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }

  const rujukanSubtitle = rujukanKembali && rujukanKembali.earliest
    ? `${fmtDate(rujukanKembali.earliest)} – ${fmtDate(rujukanKembali.latest)}`
    : "Belum ada data";

  return `
    ${navbarView(user)}

    <div class="dashboard-layout">
      ${sidebarBidanView(user, "dashboard")}
      
      <main class="dashboard-main">
        <h1 class="dashboard-title">Dashboard Bidan</h1>
        
        <!-- Stats Cards -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon calendar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Jumlah Pasien Rujukan Kembali</div>
              <div class="stat-value">${totalPatients}</div>
              <div class="stat-time">${rujukanSubtitle}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon clock-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Sesi Mendatang</div>
              <div class="stat-value">${upcomingCount}</div>
              <div class="stat-time">Minggu ini</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Jumlah Pasien</div>
              <div class="stat-value">${pasienMendaftar}</div>
              <div class="stat-time">Tahun Ini</div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Sesi Hari Ini -->
          <div class="content-card sesi-hari-ini">
            <h2 class="section-title">Sesi Hari Ini</h2>
            <p class="section-date">${dateStr}<br>${timeStr} WITA</p>
            
            <div class="sesi-list">
              ${
                hasTodaySessions
                  ? todaySessions.map((session) => {
                      const date = new Date(session.tanggal);
                      const dStr = date.toLocaleDateString("id-ID", {
                        day: "2-digit", month: "long", year: "numeric",
                      });
                      return `
                        <div class="sesi-item">
                          <div class="sesi-time">
                            <strong>${dStr}</strong>
                            <span>${session.waktu}</span>
                          </div>
                          <div class="sesi-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                              <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                              <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                            ${session.jumlah_pasien} pasien
                          </div>
                          <a href="#/manajemen-pendaftar?kegiatan=${session.id}" class="sesi-link">Lihat Detail</a>
                        </div>
                      `;
                    }).join("")
                  : `<div class="sesi-item"><p style="color: #6b7280; margin: 0;">Tidak ada sesi hari ini</p></div>`
              }
            </div>
          </div>

          <!-- Pengingat Pasien Berkala -->
          <div class="content-card pasien-section">
            <div class="pengingat-header">
              <h2 class="section-title">Pengingat Pasien Berkala</h2>
              <label class="pengingat-toggle">
                <input type="checkbox" id="sembunyikanSelesai"> Sembunyikan Selesai
              </label>
            </div>
            <div class="pasien-header">
              <div>Nama</div>
              <div>Waktu</div>
              <div>Action</div>
            </div>

            <div class="pasien-list" id="pengingatList">
              ${
                hasPengingat
                  ? pengingatPasien.map((patient) => {
                      let badgeClass = "status-upcoming";
                      if (patient.waktu === "Terlewat") badgeClass = "status-terlewat";
                      else if (patient.waktu === "Selesai") badgeClass = "status-selesai";

                      return `
                        <div class="pasien-row pengingat-item">
                          <div class="pasien-col">${patient.nama}</div>
                          <div class="pasien-col">
                            <span class="status-badge ${badgeClass}">${patient.waktu}</span>
                          </div>
                          <div class="pasien-col">
                            <a href="#/pasien/${patient.id}" class="action-link">Detail</a>
                          </div>
                        </div>
                      `;
                    }).join("")
                  : `
                    <div class="pasien-row">
                      <div class="pasien-col" style="grid-column: 1 / -1; text-align: center; color: #6b7280;">
                        Tidak ada data pasien
                      </div>
                    </div>
                  `
              }
            </div>

            ${hasPengingat && pengingatPasien.length > 4 ? `
            <div class="pengingat-pagination">
              <button class="pgn-btn" id="pengingatPrev" disabled>&#8249;</button>
              <span id="pengingatPageInfo">1 / ${Math.ceil(pengingatPasien.length / 4)}</span>
              <button class="pgn-btn" id="pengingatNext">&#8250;</button>
            </div>
            ` : ""}
          </div>
        </div>

        <!-- Sesi Mendatang -->
        <div class="content-card sesi-mendatang">
          <div class="section-title">
            <h2>Sesi Mendatang</h2>
            <button class="btn-tambah" id="addSessionBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Tambah
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="sesi-table">
              <thead>
                <tr>
                  <th>TOPIC</th>
                  <th>TANGGAL</th>
                  <th>WAKTU</th>
                  <th>LOKASI</th>
                </tr>
              </thead>
              <tbody>
                ${
                  hasUpcomingSessions
                    ? upcomingSessions.map((session) => {
                        const date = new Date(session.tanggal);
                        const dStr = date.toLocaleDateString("id-ID", {
                          day: "2-digit", month: "long", year: "numeric",
                        });
                        return `
                          <tr>
                            <td>${session.topik}</td>
                            <td>${dStr}</td>
                            <td>${session.waktu}</td>
                            <td>${session.lokasi}</td>
                          </tr>
                        `;
                      }).join("")
                    : `<tr><td colspan="4" class="no-data">Tidak ada sesi mendatang</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
}
