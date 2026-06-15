import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, Sparkles } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { email, role, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);

  // Sync auth and wishlist on load
  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') !== 'light';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);



  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          <span>Nexus<span className="text-foreground font-light">Catalog</span></span>
        </Link>

        {/* Navigation & Controls */}
        <nav className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Auth Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden lg:inline-block text-muted-foreground">
                Hi, <span className="text-foreground font-semibold">{email}</span>
              </span>

              {role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors mr-2">
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-full hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
