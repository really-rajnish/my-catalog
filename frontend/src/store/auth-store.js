import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  username: null,
  role: null,
  isAuthenticated: false,

  login: (token, username, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    set({ token, username, role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    set({ token: null, username: null, role: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username) {
      set({ token, username, role, isAuthenticated: true });
    } else {
      set({ token: null, username: null, role: null, isAuthenticated: false });
    }
  },
}));
