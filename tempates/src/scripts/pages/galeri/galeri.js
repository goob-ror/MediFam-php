import navbarView from "../../components/navbar";
import footerView from "../../components/footer";
import authService from "../../services/auth-service";

export default function galeriView() {
  const user = authService.getUser();

  return `
    ${navbarView(user)}

    <section class="galeri-section">
      <div class="galeri-container">
        <h1 class="galeri-title">Galeri Tim Medis</h1>
        
        <div class="galeri-grid">
          <!-- Doctor 1 -->
          <div class="galeri-item">
            <img src="/public/image/doctor.png" alt="Doctor 1" class="galeri-image" />
          </div>

          <!-- Doctor 2 -->
          <div class="galeri-item">
            <img src="/public/image/doctor.png" alt="Doctor 2" class="galeri-image" />
          </div>

          <!-- Doctor 3 -->
          <div class="galeri-item">
            <img src="/public/image/doctor.png" alt="Doctor 3" class="galeri-image" />
          </div>

          <!-- Doctor 4 -->
          <div class="galeri-item">
            <img src="/public/image/doctor.png" alt="Doctor 4" class="galeri-image" />
          </div>

          <!-- Doctor Team - Wide -->
          <div class="galeri-item galeri-item-wide">
            <img src="/public/image/doctorTeam.png" alt="Doctor Team" class="galeri-image" />
          </div>
        </div>
      </div>
    </section>

    ${footerView()}
  `;
}
