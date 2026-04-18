import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

export default function manajemenSesiView(user) {
  return `
    ${navbarView(user)}

    <div class="dashboard-layout">
      ${sidebarBidanView(user, "sesi")}
      
      <main class="dashboard-main">
        <h1 class="dashboard-title">Manajemen Sesi Safari KB</h1>
        
        <div class="manajemen-sesi-container">
          <div class="sesi-header-actions">
            <div class="filter-group">
              <select id="statusFilter" class="filter-select">
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="terjadwal">Terjadwal</option>
                <option value="berlangsung">Berlangsung</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
            <button class="btn btn-primary" id="btnTambahSesi">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Tambah Sesi
            </button>
          </div>

          <div class="table-container">
            <table id="sesiTable" class="display" style="width:100%">
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
}
