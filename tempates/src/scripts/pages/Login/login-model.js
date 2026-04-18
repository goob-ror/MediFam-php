import authService from "../../services/auth-service";

export default class LoginModel {
  async login(username, password) {
    return await authService.login(username, password);
  }
}
