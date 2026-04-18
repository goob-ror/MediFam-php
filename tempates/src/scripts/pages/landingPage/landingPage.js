import navbarView from "../../components/navbar";
import footerView from "../../components/footer";
import authService from "../../services/auth-service";

export default function landingPageView() {
  // Check if user is logged in
  const user = authService.getUser();

  // Debug: Log user data to verify role
  if (user) {
    console.log("Landing page user data:", user);
    console.log("User role:", user.role);
  }

  return `
    ${navbarView(user)}
    
    <!-- Hero Section -->
    <section class="hero-section" id="beranda-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Keluarga Bahagia Dimulai dari Rencana Tepat</h1>
            <p class="hero-description">
              Ambil keputusan cerdas tentang jarak kehamilan dan jumlah anak. 
              Dapatkan informasi lengkap dan layanan KB yang aman, terpercaya, 
              dan mudah diakses.
            </p>
            <button class="btn-register-now">Daftar Sekarang</button>
          </div>
          <div class="hero-image-wrapper">
            <img src="/public/image/landing page_1.png" alt="Happy Family" class="hero-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Mid-Page Content -->
    <section class="mid-section">
      <div class="container">
        <div class="feature-buttons-wrapper">
          <button class="btn btn-feature" data-content="kb">Apa Itu Keluarga Berencana</button>
          <button class="btn btn-feature active" data-content="safari">Apa Itu Program SAFARI</button>
        </div>
        
        <div class="program-description" id="programDescription">
          <div id="safariContent">
            <p>
              <strong>SAFARI</strong> adalah program konsultasi dan edukasi Keluarga Berencana (KB) bergerak 
              yang dirancang khusus untuk menjangkau masyarakat di daerah-daerah dengan akses 
              layanan kesehatan tradisional yang terbatas. Kami menyediakan layanan yang rahasia, 
              tanpa menghakimi, dan membantu Anda membuat keputusan perencanaan keluarga yang 
              tepat dan terinformasi.
            </p>
          </div>
          <div id="kbContent" style="display: none;">
            <p>
              <strong>Keluarga Berencana (KB)</strong> adalah upaya perencanaan untuk mengatur jarak kehamilan, 
              jumlah anak, dan waktu yang tepat untuk memiliki anak, sesuai dengan kesiapan fisik, mental, 
              dan finansial pasangan.
            </p>
            <p>
              Program KB sangat penting karena membantu meningkatkan kualitas hidup keluarga: menjaga kesehatan 
              ibu, mendukung perkembangan anak yang optimal, serta menciptakan stabilitas ekonomi dan keharmonisan 
              rumah tangga.
            </p>
            <p>
              Dengan KB, setiap pasangan dapat merencanakan masa depan keluarga yang lebih sehat, sejahtera, 
              dan bahagia.
            </p>
          </div>
        </div>
        
        <!-- Di Hide Dulu -->
        <div class="text-center" style="display: none;">
          <button class="btn btn-safari-schedule">
            Temukan Jadwal Kunjungan SAFARI di Daerah Anda!
          </button>
        </div>
        <!-- Di Hide Dulu -->
      </div>
    </section>

    <!-- Feature/Benefit Section -->
    <section class="feature-section">
      <div class="container">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/public/logo/love.png" alt="Love" class="feature-icon-img" />
            </div>
            <h3 class="feature-title">Rahasia</h3>
            <p class="feature-text">Konsultasi dan Data Anda yang Terjaga</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/public/logo/lokasi (1).png" alt="Location" class="feature-icon-img" />
            </div>
            <h3 class="feature-title">Mudah Diakses</h3>
            <p class="feature-text">Berbagai Sesi Kegiatan di Tempat Sekitar</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/public/logo/buku.png" alt="Book" class="feature-icon-img" />
            </div>
            <h3 class="feature-title">Edukasional</h3>
            <p class="feature-text">Edukasi Rencana KB yang komprehensif</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule Section -->
    <section class="schedule-section" id="jadwal-section">
      <div class="container">
        <h2 class="schedule-title">Lihat Jadwal SAFARI Yang Akan Datang!</h2>
        <div class="schedule-table-wrapper">
          <table class="schedule-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Lokasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3 November 2025</td>
                <td>10:30 WITA</td>
                <td>Jl. Ampera, Rawa Makmur</td>
                <td><span class="status-badge status-ongoing">Ongoing</span></td>
              </tr>
              <tr>
                <td>3 Oktober 2025</td>
                <td>10:30 WITA</td>
                <td>Jl. Ampera, Rawa Makmur</td>
                <td><span class="status-badge status-completed">Selesai</span></td>
              </tr>
              <tr>
                <td>17 Oktober 2025</td>
                <td>10:30 WITA</td>
                <td>Jl. Ampera, Rawa Makmur</td>
                <td><span class="status-badge status-completed">Selesai</span></td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button class="pagination-btn">«</button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">»</button>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button class="btn btn-register-safari">Daftar Sesi SAFARI</button>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="faq-title">Pertanyaan Yang Sering Diajukan</h2>
        <div class="faq-container">
          <div class="faq-item">
            <div class="faq-question">
              <span>Apakah program ini gratis?</span>
              <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
            <div class="faq-answer">
              <p>Iya, Anda tidak perlu membayar sepeserpun untuk menghadiri program ini.</p>
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">
              <span>Apa yang harus saya bawa?</span>
              <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
            <div class="faq-answer" style="display: none;">
              <p>Anda hanya perlu membawa KTP atau identitas diri lainnya untuk pendaftaran.</p>
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">
              <span>Siapa saja yang bisa mendaftar?</span>
              <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
            <div class="faq-answer" style="display: none;">
              <p>Program ini terbuka untuk semua pasangan yang ingin merencanakan keluarga mereka, baik yang sudah menikah maupun yang akan menikah.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${footerView()}
  `;
}
