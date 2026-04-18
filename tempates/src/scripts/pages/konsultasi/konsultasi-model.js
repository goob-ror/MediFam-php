import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class KonsultasiModel {
    constructor() {
        this.apiUrl = "/api/bidan"; // Adjust based on your API endpoint
    }

    async getDashboardData() {
        const token = authService.getToken();
        const response = await fetch(`${API_BASE_URL}/dashboard/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async getBidanList() {
        // Mock data - replace with actual API call
        // const response = await fetch(this.apiUrl);
        // return await response.json();

        return [
            {
                id: 1,
                name: "Siti Nurhaliza",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Praktik Mandiri",
                experience: 8,
                phone: "081234567890",
                isAvailable: true
            },
            {
                id: 2,
                name: "Dewi Lestari",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Puskesmas",
                experience: 5,
                phone: "081234567891",
                isAvailable: true
            },
            {
                id: 3,
                name: "Rina Wijaya",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Konsultan KB",
                experience: 10,
                phone: "081234567892",
                isAvailable: false
            },
            {
                id: 4,
                name: "Maya Sari",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Praktik Mandiri",
                experience: 6,
                phone: "081234567893",
                isAvailable: true
            },
            {
                id: 5,
                name: "Ani Kusuma",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Puskesmas",
                experience: 7,
                phone: "081234567894",
                isAvailable: true
            },
            {
                id: 6,
                name: "Lina Hartati",
                avatar: "/public/image/userAvatar-Female.png",
                specialization: "Bidan Konsultan KB",
                experience: 12,
                phone: "081234567895",
                isAvailable: false
            }
        ];
    }
}
