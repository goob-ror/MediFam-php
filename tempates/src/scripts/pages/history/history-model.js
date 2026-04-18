import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class HistoryModel {
  constructor() {
    this.safariUrl = `${API_BASE_URL}/safari`;
    this.dashboardUrl = `${API_BASE_URL}/dashboard`;
  }

  async getDashboardData() {
    const token = authService.getToken();
    const response = await fetch(`${this.dashboardUrl}/user`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getHistory() {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/history`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
}
