import axios from 'axios';

const AUTH_KEYS = {
  student: {
    token: 'studentToken',
    user: 'studentUser'
  },
  admin: {
    token: 'adminToken',
    user: 'adminUser'
  }
};

function getCurrentScope() {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'student';
}

function clearAuthForScope(scope) {
  const keys = AUTH_KEYS[scope];
  localStorage.removeItem(keys.token);
  localStorage.removeItem(keys.user);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const keys = AUTH_KEYS[getCurrentScope()];
  const token = localStorage.getItem(keys.token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthForScope(getCurrentScope());
    }

    return Promise.reject(error);
  }
);

export default api;
