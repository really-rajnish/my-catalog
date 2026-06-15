import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [email, setEmail] = useState(localStorage.getItem('email') || null);

  const login = (newToken, newRole, newEmail) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    if (newEmail) localStorage.setItem('email', newEmail);
    setToken(newToken);
    setRole(newRole);
    if (newEmail) setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
