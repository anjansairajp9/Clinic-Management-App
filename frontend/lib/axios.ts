import axios from "axios";
import { API_BASE_URL } from "@/constants/api";
import {
  getAccessToken,
  refreshToken,
} from "./auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token =
      getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    if (
      originalRequest.url ===
      "/refresh"
    ) {
      return Promise.reject(
        error
      );
    }

    if (
      error.response?.status ===
        401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry =
        true;

      try {
        const newToken =
          await refreshToken();

        if (newToken) {
          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          return api(
            originalRequest
          );
        }
      } catch {
        localStorage.removeItem(
          "access_token"
        );

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;
