// import axios from "axios";
// import { store } from "../redux/store/store";
// import { logoutAction, setAuth } from "../redux/slice/adminSlice";

// const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
// const REFRESH_URL = import.meta.env.VITE_BACKEND_REFRESH_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         await axios.get(REFRESH_URL, { withCredentials: true });
//         return axios(originalRequest);
//       } catch (err) {
//         store.dispatch(logoutAction());
//         store.dispatch(setAuth({ isAuthenticated: false }));
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;


// api.ts
import axios from "axios";
import { store } from "../redux/store/store";
import { logoutAction, setAuth } from "../redux/slice/adminSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const REFRESH_URL = import.meta.env.VITE_BACKEND_REFRESH_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important for cookies
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

// Process queued requests after refresh completes
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already running, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Mark this request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await api.get(REFRESH_URL); // use api instance, so it shares baseURL & cookies
        processQueue(null); // retry queued requests
        return api(originalRequest); // retry original request
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logoutAction());
        store.dispatch(setAuth({ isAuthenticated: false }));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

