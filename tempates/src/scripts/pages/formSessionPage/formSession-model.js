import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class FormSessionModel {
  constructor() {
    this.apiUrl = API_BASE_URL;
    this.safariUrl = `${API_BASE_URL}/safari`;
  }

  async getPatientByPasanganId(pasanganKbId) {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/form-session/patient/${pasanganKbId}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.json();
  }

  async getKontrasepsiList() {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/form-session/kontrasepsi`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.json();
  }

  async submitForm(pasanganKbId, payload) {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/form-session/submit/${pasanganKbId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  async markAttendance(pesertaId) {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/registrants/${pesertaId}/attendance`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ hadir: true }),
    });
    return response.json();
  }

  async getExistingSession(pasanganKbId) {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/form-session/existing/${pasanganKbId}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.json();
  }

  async updateForm(pasanganKbId, payload) {
    const token = authService.getToken();
    const response = await fetch(`${this.safariUrl}/form-session/update/${pasanganKbId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  }
}
