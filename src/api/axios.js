import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/auth/generateToken', // 🔁 Replace with your backend API
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      config.headers.Authorization = `${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: redirect to login page or show unauthorized message
      console.warn('Unauthorized - redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
