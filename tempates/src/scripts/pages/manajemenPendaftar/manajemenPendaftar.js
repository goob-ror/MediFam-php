import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

export default function manajemenPendaftarView(user, registrants, safariEvents) {
  return `
    ${navbarView(user)}
    
    <div class="dashboard-container">
      ${sidebarBidanView(user, "pendaftar")}
      
      <main class="dashboard-main">
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Manajemen Pendaftar Safari KB</h1>
            <p class="dashboard-subtitle">Kelola pendaftaran peserta kegiatan Safari KB</p>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-group">
            <label for="filterKegiatan">Filter Kegiatan:</label>
            <select id="filterKegiatan" class="filter-select">
              <option value="">Semua Kegiatan</option>
              ${safariEvents.map(event => `
                <option value="${event.id}">${event.judul_kegiatan} - ${formatDate(event.tanggal_kegiatan)}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="filter-group">
            <label for="filterStatus">Status Kehadiran:</label>
            <select id="filterStatus" class="filter-select">
              <option value="">Semua Status</option>
              <option value="1">Hadir</option>
              <option value="0">Belum Hadir</option>
            </select>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e3f2fd;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196f3" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Pendaftar</p>
              <p class="stat-value" id="totalPendaftar">${registrants.length}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #e8f5e9;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Hadir</p>
              <p class="stat-value" id="totalHadir">${registrants.filter(r => r.hadir).length}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #fff3e0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Belum Hadir</p>
              <p class="stat-value" id="totalBelumHadir">${registrants.filter(r => !r.hadir).length}</p>
            </div>
          </div>
        </div>

        <!-- DataTable Section -->
        <div class="table-container">
          <div class="table-header">
            <h2>Daftar Pendaftar</h2>
            <button class="btn-primary" id="btnExportData">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export
            </button>
          </div>

          <div class="search-box" style="margin-bottom: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input type="text" id="searchPendaftarPasien" placeholder="Cari pasien..." />
          </div>
          
          <table id="registrantsTable" class="display" style="width:100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Peserta</th>
                <th>NIK</th>
                <th>No. HP</th>
                <th>Kegiatan</th>
                <th>Tanggal Kegiatan</th>
                <th>Tanggal Daftar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${registrants.map((reg, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${reg.nama_lengkap}</td>
                  <td>${reg.nik}</td>
                  <td>${reg.no_hp || '-'}</td>
                  <td>${reg.judul_kegiatan}</td>
                  <td>${formatDate(reg.tanggal_kegiatan)}</td>
                  <td>${formatDateTime(reg.created_at)}</td>
                  <td>
                    <span class="status-badge ${reg.hadir ? 'status-hadir' : 'status-belum'}">
                      ${reg.hadir ? 'Hadir' : 'Belum Hadir'}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      ${!reg.hadir ? `
                        <a href="#/form-session?id=${reg.pasangan_kb_id}&peserta_id=${reg.id}" class="btn-action btn-check" title="Catat Data Pasien">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 21l3-1 11-11-2-2L4 18l-1 3z"></path>
                            <path d="M14 4l2 2"></path>
                          </svg>
                        </a>
                      ` : `
                        <button class="btn-action btn-uncheck" data-id="${reg.id}" title="Batalkan Kehadiran">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>`}
                      <a href="#/form-session?id=${reg.pasangan_kb_id}&peserta_id=${reg.id}&mode=view" class="btn-action btn-view" title="Lihat Detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <button class="btn-action btn-delete" data-id="${reg.id}" title="Hapus">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
