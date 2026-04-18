import konsultasiView from "./konsultasi";
import KonsultasiModel from "./konsultasi-model";
import authService from "../../services/auth-service";
import NavbarPresenter from "../../components/navbar-presenter";
import Swal from "sweetalert2";

export default class KonsultasiPresenter {
    constructor({ container }) {
        this.container = container;
        this.model = new KonsultasiModel();
    }

    async init() {
        await this.loadData();
        this.render();
        this.attachEventListeners();
    }

    async loadData() {
        // Load user data from localStorage or API
        try {
            // Load user data from API
            const dashboardData = await this.model.getDashboardData();
            this.user = dashboardData.user;
        } catch (error) {
            console.error("Load user data error:", error);
            // Fallback to localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                this.user = {
                    name: user.nama_lengkap || user.username,
                    avatar: user.avatar || "/public/image/userAvatar-Male.png",
                    joinDate: "N/A",
                    role: user.role
                };
            } else {
                // Redirect to login if no user data
                window.location.hash = "#/login";
                return;
            }
        }

        this.bidanList = await this.model.getBidanList();
    }

    render() {
        this.container.innerHTML = konsultasiView(this.user, this.bidanList);
    }

    attachEventListeners() {
        const navbarPresenter = new NavbarPresenter(this.container);
        navbarPresenter.attachEventListeners();

        // WhatsApp buttons
        const whatsappButtons = this.container.querySelectorAll(".btn-whatsapp");
        whatsappButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const phone = e.currentTarget.getAttribute("data-phone");
                const bidanName = e.currentTarget.getAttribute("data-name");
                this.openWhatsApp(phone, bidanName);
            });
        });

        // Logout
        const logoutLink = this.container.querySelector(".nav-item.logout");
        if (logoutLink) {
            logoutLink.addEventListener("click", async (e) => {
                e.preventDefault();
                await this.handleLogout();
            });
        }
    }

    openWhatsApp(phone, bidanName) {
        // Get current time for greeting
        const hour = new Date().getHours();
        let greeting = "selamat pagi";
        if (hour >= 12 && hour < 15) {
            greeting = "selamat siang";
        } else if (hour >= 15 && hour < 18) {
            greeting = "selamat sore";
        } else if (hour >= 18) {
            greeting = "selamat malam";
        }

        // Format phone number (remove any non-digit characters)
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Add country code if not present (assuming Indonesia +62)
        let formattedPhone = cleanPhone;
        if (cleanPhone.startsWith('0')) {
            formattedPhone = '62' + cleanPhone.substring(1);
        } else if (!cleanPhone.startsWith('62')) {
            formattedPhone = '62' + cleanPhone;
        }

        // Create WhatsApp message
        const message = `Halo ${bidanName}, ${greeting} saya ${this.user.name}`;
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    async handleLogout() {
        const result = await Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            localStorage.removeItem("user");
            window.location.hash = "#/";
        }
    }
}
