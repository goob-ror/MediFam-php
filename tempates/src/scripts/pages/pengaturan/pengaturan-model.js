import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class PengaturanModel {
    constructor() {
        this.apiUrl = `${API_BASE_URL}/user`;
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

    async updateNotification(receive_autoreminder) {
        const token = authService.getToken();
        const response = await fetch(`${this.apiUrl}/notification`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ receive_autoreminder }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result;
    }

    async updateAccount(data) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${this.apiUrl}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || "Gagal memperbarui data");
            }
            
            return result;
        } catch (error) {
            console.error("Update account error:", error);
            throw error;
        }
    }
}
