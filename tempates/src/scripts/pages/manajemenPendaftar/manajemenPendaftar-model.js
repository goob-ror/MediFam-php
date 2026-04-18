import API_BASE_URL from "../../services/api-config";
import authService from "../../services/auth-service";

export default class ManajemenPendaftarModel {
  constructor() {
    this.apiUrl = `${API_BASE_URL}/safari`;
  }

  async getRegistrants(params = {}) {
    try {
      const token = authService.getToken();
      const queryParams = new URLSearchParams(params).toString();
      
      const response = await fetch(`${this.apiUrl}/registrants?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get registrants error:", error);
      throw error;
    }
  }

  async getSafariEvents() {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${this.apiUrl}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get safari events error:", error);
      throw error;
    }
  }

  async getRegistrantDetail(id) {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${this.apiUrl}/registrants/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get registrant detail error:", error);
      throw error;
    }
  }

  async markAttendance(id) {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${this.apiUrl}/registrants/${id}/attendance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hadir: true }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Mark attendance error:", error);
      throw error;
    }
  }

  async unmarkAttendance(id) {
    try {
      const token = authService.getToken();

      const response = await fetch(`${this.apiUrl}/registrants/${id}/attendance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
        body: JSON.stringify({ hadir: false }),
      })

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Unmark attendance error:", error);
      throw error;
    }
  }

  async deleteRegistrant(id) {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${this.apiUrl}/registrants/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete registrant error:", error);
      throw error;
    }
  }
}
