import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class DashboardUserModel {
  async getDashboardData() {
    try {
      const token = authService.getToken();

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      console.error("Get dashboard data error:", error);
      throw error;
    }
  }

  async getSafariSchedules() {
    try {
      const token = authService.getToken();

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/safari-schedules`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      console.error("Get safari schedules error:", error);
      return [];
    }
  }

  async registerForSafari (scheduleId) {
    try {
      const token = authService.getToken();
      if(!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/dashboard/safari-register/${scheduleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Register safari error:", error);
      return { success: false, message: "Terjadi kesalahan saat mendaftar safari" };
    }
  }

  async cancelSafariRegistration(scheduleId) {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/dashboard/safari-cancel/${scheduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Cancel safari error:", error);
      return { success: false, message: "Terjadi kesalahan saat membatalkan pendaftaran" };
    }
  }
}

