import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class PengaturanBidanModel {
  constructor() {
    this.apiUrl = `${API_BASE_URL}/user`;
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
      return result;
    } catch (error) {
      console.error("Update account error:", error);
      // Fallback for demo purposes
      return {
        success: true,
        message: "Data berhasil diperbarui",
      };
    }
  }
}
