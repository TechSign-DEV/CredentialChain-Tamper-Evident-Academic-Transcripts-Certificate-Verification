
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("credentialchain_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let Axios set the correct Content-Type for FormData uploads.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (config.data && typeof config.data === "object") {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;
