import axios from "axios";
import { store } from "../redux/store/store";
import { logoutAction, setAuth } from "../redux/slice/adminSlice";

// const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const REFRESH_URL = import.meta.env.VITE_BACKEND_REFRESH_URL;

const api = axios.create({
  baseURL:"/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get(REFRESH_URL, { withCredentials: true });
        return axios(originalRequest);
      } catch (err) {
        store.dispatch(logoutAction());
        store.dispatch(setAuth({ isAuthenticated: false }));
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
