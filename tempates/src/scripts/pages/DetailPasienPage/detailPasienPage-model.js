import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class DetailPasienModel {
  constructor() {
    this.apiUrl = `${API_BASE_URL}/patients`;
  }

  async getPatientDetail(id) {
    const token = authService.getToken();
    const response = await fetch(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.json();
  }

  async getPatientHistory(id) {
    const token = authService.getToken();
    const response = await fetch(`${this.apiUrl}/${id}/history`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.json();
  }
}
