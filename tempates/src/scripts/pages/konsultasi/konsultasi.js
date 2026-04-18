import navbarView from "../../components/navbar";
import dashboardSidebar from "../../components/dashboard-sidebar";

export default function konsultasiView(user, bidanList) {
    return `
    <style>
        .landing-nav-link.nav-active {
            color: var(--dark-blue);
            text-decoration: underline;
            text-underline-offset: 5px;
        }
    </style>
    ${navbarView(user)}

    <div class="dashboard-layout">
        ${dashboardSidebar(user, 'konsultasi')}

        <!-- Main Content -->
        <main class="dashboard-main">
            <h1 class="dashboard-title">Konsultasi dengan Bidan</h1>
            <p class="konsultasi-subtitle">Pilih bidan untuk memulai konsultasi melalui WhatsApp</p>

            <div class="bidan-grid">
                ${bidanList && bidanList.length > 0 ? bidanList.map(bidan => `
                    <div class="bidan-card">
                        <div class="bidan-avatar-wrapper">
                            <img src="${bidan.avatar || '/public/image/userAvatar-Female.png'}" alt="${bidan.name}" class="bidan-avatar" />
                            <div class="bidan-status ${bidan.isAvailable ? 'available' : 'unavailable'}"></div>
                        </div>
                        <div class="bidan-info">
                            <h3 class="bidan-name">${bidan.name}</h3>
                            <p class="bidan-specialization">${bidan.specialization || 'Bidan'}</p>
                            ${bidan.experience ? `<p class="bidan-experience">${bidan.experience} tahun pengalaman</p>` : ''}
                            <div class="bidan-availability">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                <span>${bidan.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}</span>
                            </div>
                        </div>
                        <button class="btn-whatsapp" data-phone="${bidan.phone}" data-name="${bidan.name}" ${!bidan.isAvailable ? 'disabled' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                            </svg>
                            Chat WhatsApp
                        </button>
                    </div>
                `).join('') : `
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                        </svg>
                        <p>Belum ada bidan yang tersedia saat ini</p>
                    </div>
                `}
            </div>
        </main>
    </div>
    `;
}
