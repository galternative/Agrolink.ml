import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const TOKEN_KEY = "agrolink_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // The frontend can run while the backend is unavailable.
    // Cloudflare may return index.html with HTTP 200 for /api/* requests.
    // Public list pages expect arrays, so normalize unexpected list
    // responses to [] instead of allowing .map/.filter to crash React.
    const url = String(res.config?.url || "");
    const isListEndpoint =
      /\/(categories|team|partners)(?:\?|$)/.test(url) ||
      /\/products(?:\?.*)?$/.test(url);

    if (isListEndpoint && !Array.isArray(res.data)) {
      if (Array.isArray(res.data?.items)) {
        res.data = res.data.items;
      } else if (Array.isArray(res.data?.data)) {
        res.data = res.data.data;
      } else {
        res.data = [];
      }
    }

    return res;
  },
  (err) => {
    if (
      err?.response?.status === 401 &&
      window.location.pathname.startsWith("/admin") &&
      !window.location.pathname.includes("/admin/login")
    ) {
      clearToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);
