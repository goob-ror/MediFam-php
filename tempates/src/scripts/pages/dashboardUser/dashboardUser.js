import navbarView from "../../components/navbar";
import dashboardSidebar from "../../components/dashboard-sidebar";

export default function dashboardUserView(user, upcomingRoutine, safariSchedules) {
    const hasUpcomingRoutine = upcomingRoutine !== null;
    const hasSafariSchedule = safariSchedules && safariSchedules.length > 0;

    return `
    ${navbarView(user)}

    <div class="dashboard-layout">
        ${dashboardSidebar(user, 'dashboard')}

        <!-- Main Content -->
        <main class="dashboard-main">
            <h1 class="dashboard-title">Selamat Datang Kembali, ${user.name}!</h1>

            <!-- Cards Section -->
            <div class="dashboard-cards">
                <!-- Upcoming Routine Card -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3>Jadwal Rutin Mendatang</h3>
                        ${hasUpcomingRoutine ? '<span class="badge badge-success">Terdaftar</span>' : ''}
                    </div>
                    ${hasUpcomingRoutine ? `
                        <div class="card-content">
                            <div class="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                <div>
                                    <strong>Tanggal</strong>
                                    <p>${upcomingRoutine.date}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                <div>
                                    <strong>Waktu</strong>
                                    <p><i>${upcomingRoutine.time}</i></p>
                                </div>
                            </div>
                            <div class="info-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                </svg>
                                <div>
                                    <strong>Lokasi</strong>
                                    <p>${upcomingRoutine.location}</p>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="card-content empty">
                            <p>Belum ada jadwal rutin yang terdaftar.</p>
                        </div>
                    `}
                </div>

                <!-- Safari Schedule Card -->
                <div class="dashboard-card">
                    <h3>Jadwal Kegiatan Safari</h3>
                    <div class="card-content">
                        ${hasSafariSchedule ? `
                            <p class="info-text">Belum ada kegiatan Safari yang terdaftar. Pilih kegiatan Safari di bawah ini!</p>
                            <button class="btn btn-info" id="viewSafariBtn">Lihat Jadwal Safari</button>
                        ` : `
                            <p class="info-text">Belum ada kegiatan Safari yang terdaftar. Pilih kegiatan Safari di bawah ini!</p>
                            <button class="btn btn-info" id="viewSafariBtn">Lihat Jadwal Safari</button>
                        `}
                    </div>
                </div>
            </div>

            <!-- Safari Schedule Table -->
            <div class="safari-schedule-section">
                <h2>Jadwal Kegiatan SAFARI</h2>
                <div class="table-container">
                    <table class="safari-table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Waktu</th>
                                <th>Lokasi</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${safariSchedules && safariSchedules.length > 0 ? safariSchedules.map(schedule => `
                                <tr>
                                    <td>${schedule.date}</td>
                                    <td>${schedule.time}</td>
                                    <td>${schedule.location}</td>
                                    <td>
                                        ${schedule.status === 'available' 
                                            ? schedule.isRegistered
                                                ? `<div class="action-cell">
                                                    <button class="btn btn-success btn-sm" disabled>Sudah Terdaftar</button>
                                                    <button class="btn btn-danger btn-sm btn-cancel-safari" data-id="${schedule.id}">Batalkan</button>
                                                   </div>`
                                                : `<button class="btn btn-primary btn-sm btn-register-safari" data-id="${schedule.id}">Daftar</button>`
                                            : `<button class="btn btn-secondary btn-sm" disabled>Telah Berakhir</button>`
                                        }
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="4" class="text-center">Tidak ada jadwal tersedia</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                    <div class="pagination">
                        <button class="pagination-btn" disabled>‹</button>
                        <span class="pagination-number active">1</span>
                        <button class="pagination-btn" disabled>›</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `;
}
