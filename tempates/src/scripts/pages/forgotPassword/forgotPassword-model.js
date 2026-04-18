import API_BASE_URL from "../../services/api-config";

export default class ForgotPasswordModel {
  async requestOtp(phone) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  }

  async verifyOtp(phone, otp) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return res.json();
  }

  async resetPassword(phone, otp, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, newPassword }),
    });
    return res.json();
  }
}
