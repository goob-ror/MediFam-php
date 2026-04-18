import navbarView from "../../components/navbar";
import sidebarBidanView from "../../components/sidebar-bidan";

export default function manajemenPasienView(
  user,
  pasienData,
  pagination,
  sortOrder
) {
  const hasPasien = pasienData && pasienData.length > 0;
  const sortIcon =
    sortOrder === "ASC"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>`;

  // Generate pagination numbers
  let paginationHTML = "";
  if (pagination.totalPages > 0) {
    for (let i = 1; i <= pagination.totalPages; i++) {
      if (
        i === 1 ||
        i === pagination.totalPages ||
        (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)
      ) {
        paginationHTML += `<div class="pagination-number ${
          i === pagination.currentPage ? "active" : ""
        }" data-page="${i}">${i}</div>`;
      } else if (
        i === pagination.currentPage - 2 ||
        i === pagination.currentPage + 2
      ) {
        paginationHTML += '<div class="pagination-ellipsis">...</div>';
      }
    }
  }

  return `
    ${navbarView(user)}

    <div class="dashboard-layout">
      ${sidebarBidanView(user, "pasien")}
      
      <main class="dashboard-main">        
        <div class="manajemen-pasien-container">
        <h1 class="dashboard-title">
            Manajemen Pasien
        </h1>
          <div class="pasien-header-actions">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              <input type="text" id="searchPasien" placeholder="Cari pasien..." />
            </div>
            <button class="btn btn-primary" id="btnTambahPasien">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Tambah Pasien
            </button>
          </div>

          <div class="sort-section">
            <button class="btn-sort" id="btnSortTanggal">
              ${sortIcon}
              Sortir Berdasarkan Tanggal Rujukan Kembali
            </button>
          </div>

          <div class="table-container">
            <table class="pasien-table">
              <thead>
                <tr>
                  <th>NIK</th>
                  <th>NAMA PASIEN</th>
                  <th>JENIS KELAMIN</th>
                  <th>AKSEPTOR</th>
                  <th>TANGGAL KEMBALI</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${
                  hasPasien
                    ? pasienData
                        .map(
                          (pasien) => `
                  <tr>
                    <td>${pasien.nik || "-"}</td>
                    <td>${pasien.nama || "-"}</td>
                    <td>${pasien.jenisKelamin || "-"}</td>
                    <td>${pasien.akseptor || "-"}</td>
                    <td>
                      ${pasien.tanggalKembali
                        ? pasien.statusKembali
                          ? `<span class="status-badge ${pasien.statusKembali === "Terlewat" ? "status-terlewat" : "status-selesai"}">${pasien.statusKembali}</span>`
                          : pasien.tanggalKembali
                        : "Tidak Ada"}
                    </td>
                    <td>
                      <a href="#/pasien/${pasien.id}" class="action-link">Lihat Detail</a>
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : `
                  <tr>
                    <td colspan="6" class="text-center">
                      <div class="no-data">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3; margin-bottom: 1rem;">
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                          <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                          <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                        </svg>
                        <p>Tidak ada data pasien</p>
                      </div>
                    </td>
                  </tr>
                `
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
}
