const API_BASE_URL = "http://localhost:3000/api";

class ManajemenPasienModel {
  async getPatients(params = {}) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await fetch(
        `${API_BASE_URL}/patients?${queryParams.toString()}`,
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
        throw new Error(result.message || "Gagal mengambil data pasien");
      }

      return result;
    } catch (error) {
      console.error("Get patients error:", error);
      throw error;
    }
  }

  async getPatientDetail(patientId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil detail pasien");
      }

      return result;
    } catch (error) {
      console.error("Get patient detail error:", error);
      throw error;
    }
  }

  async createPatient(patientData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan pasien");
      }

      return result;
    } catch (error) {
      console.error("Create patient error:", error);
      throw error;
    }
  }
}

export default ManajemenPasienModel;
