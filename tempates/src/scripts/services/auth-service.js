import API_BASE_URL from "./api-config";

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.data.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error("Login service error:", error);
      return {
        success: false,
        message: "Tidak dapat terhubung ke server",
      };
    }
  }

  async register(username, phone, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, phone, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Register service error:", error);
      return {
        success: false,
        message: "Tidak dapat terhubung ke server",
      };
    }
  }

  async checkAuth() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          message: "Token tidak ditemukan",
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        this.logout();
      }

      return data;
    } catch (error) {
      console.error("Check auth service error:", error);
      return {
        success: false,
        message: "Tidak dapat terhubung ke server",
      };
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.hash = "#/login";
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
