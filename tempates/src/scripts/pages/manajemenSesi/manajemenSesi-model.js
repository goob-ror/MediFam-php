const API_BASE_URL = "http://localhost:3000/api";

class ManajemenSesiModel {
  async getSessions(params = {}) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await fetch(
        `${API_BASE_URL}/sessions?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data sesi");
      }

      return result;
    } catch (error) {
      console.error("Get sessions error:", error);
      throw error;
    }
  }

  async getSessionDetail(sessionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil detail sesi");
      }

      return result;
    } catch (error) {
      console.error("Get session detail error:", error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat sesi");
      }

      return result;
    } catch (error) {
      console.error("Create session error:", error);
      throw error;
    }
  }

  async updateSession(sessionId, sessionData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengupdate sesi");
      }

      return result;
    } catch (error) {
      console.error("Update session error:", error);
      throw error;
    }
  }

  async deleteSession(sessionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus sesi");
      }

      return result;
    } catch (error) {
      console.error("Delete session error:", error);
      throw error;
    }
  }
}

export default ManajemenSesiModel;
