import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class DashboardBidanModel {
  async getDashboardData() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error("Get dashboard data error:", error);
      throw error;
    }
  }

  async getTodaySessions() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan/sessions/today`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error("Get today sessions error:", error);
      return [];
    }
  }

  async getPasienMendaftar() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data.pasienMendaftar || 0;
    } catch (error) {
      console.error("Get pasien mendaftar error:", error);
      return 0;
    }
  }

  async getRujukanKembali() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan/rujukan-kembali`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error("Get rujukan kembali error:", error);
      return { total: 0, earliest: null, latest: null };
    }
  }

  async getPengingatPasien() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan/pengingat-pasien`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error("Get pengingat pasien error:", error);
      return [];
    }
  }

  async getUpcomingSessions() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token found");
      const response = await fetch(`${API_BASE_URL}/dashboard/bidan/sessions/upcoming`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error("Get upcoming sessions error:", error);
      return [];
    }
  }
}
