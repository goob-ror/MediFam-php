import authService from "../../services/auth-service";

export default class RegisterModel {
  async register(username, phone, password) {
    return await authService.register(username, phone, password);
  }
}
