import { publicApi } from './api';

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

function getScopeFromRole(role) {
  return role === 'ADMIN' ? 'admin' : 'student';
}

function normalizeScope(scope) {
  if (scope === 'admin' || scope === 'student') {
    return scope;
  }

  const path = window.location.pathname;
  return path.startsWith('/admin') ? 'admin' : 'student';
}

function clearLegacyAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function registerUser(userData) {
  const response = await publicApi.post('/register', userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await publicApi.post('/login', credentials);
  return response.data;
}

export function saveAuth(authData, scope = getScopeFromRole(authData.role)) {
  const keys = AUTH_KEYS[normalizeScope(scope)];

  localStorage.setItem(keys.token, authData.token);
  localStorage.setItem(keys.user, JSON.stringify({
    userId: authData.userId,
    name: authData.name,
    email: authData.email,
    level: authData.level,
    role: authData.role || 'STUDENT'
  }));
  clearLegacyAuth();
}

export function getAuthUser(scope) {
  const keys = AUTH_KEYS[normalizeScope(scope)];
  const user = localStorage.getItem(keys.user);
  return user ? JSON.parse(user) : null;
}

export function getAuthToken(scope) {
  const keys = AUTH_KEYS[normalizeScope(scope)];
  return localStorage.getItem(keys.token);
}

export function isAuthenticated(scope) {
  return Boolean(getAuthToken(scope));
}

export function isAdmin(scope) {
  return getAuthUser(scope)?.role === 'ADMIN';
}

export function logoutUser(scope) {
  const keys = AUTH_KEYS[normalizeScope(scope)];
  localStorage.removeItem(keys.token);
  localStorage.removeItem(keys.user);
  clearLegacyAuth();
}
