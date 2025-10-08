import axios from "axios";
import { 
  validateUserInput, 
  validateUserLoginInput, 
  validateUserUpdateInput, 
  validateUserPasswordInput 
} from "../utils";
import { handleAxiosError } from "../utils/axiosStatusHandler";

const BASE_URL = "https://task-manager-fbg3.onrender.com/api/v1/auth/";

class AuthService {

  async healthcheck({ token }) {
    try {
      const res = await axios.get(`${BASE_URL.replace('/auth/', '/healthcheck/')}`, {
        headers: {
          "Authorization": ` ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return { success: true, message: "Health check successful.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Health Check Error:", errors);
      return { success: false, error: errors };
    }
  }

  async signup({ fullName, username, password, email }) {
    const validationError = validateUserInput({ fullName, username, email, password });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.post(`${BASE_URL}signup`, { fullName, username, email, password }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      return { success: true, message: "Signup successful.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Signup Error:", errors);
      return { success: false, error: errors };
    }
  }

  async login({ email, password }) {
    const validationError = validateUserLoginInput({ email, password });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.post(`${BASE_URL}login`, { email, password }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      return { success: true, message: "Login successful.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Login Error:", errors);
      return { success: false, error: errors };
    }
  }

  async getCurrentUser({ token }) {
    if (!token) return { success: false, error: "No token provided" };

    try {
      const res = await axios.get(`${BASE_URL}current-user`, {
        headers: {
          "Authorization": ` ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return { success: true, message: "Fetched current user.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Get Current User Error:", errors);
      return { success: false, error: errors };
    }
  }

  async updateUserProfile({ fullName, email, token }) {
    const validationError = validateUserUpdateInput({ fullName, email });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.put(`${BASE_URL}update-user`, { fullName, email }, {
        headers: {
          "Authorization": ` ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return { success: true, message: "Profile updated successfully.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Update Profile Error:", errors);
      return { success: false, error: errors };
    }
  }

  async updateUserPassword({ oldPassword, newPassword, token }) {
    const validationError = validateUserPasswordInput({ oldPassword, newPassword });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.put(`${BASE_URL}change-password`, { oldPassword, newPassword }, {
        headers: {
          "Authorization": ` ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return { success: true, message: "Password updated successfully.", data: res.data.data };

    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Update Password Error:", errors);
      return { success: false, error: errors };
    }
  }
}

export const authService = new AuthService();
