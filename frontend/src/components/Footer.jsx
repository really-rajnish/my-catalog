import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="font-bold text-primary">Nexus</span>
            <span className="font-light text-foreground">Catalog</span>
            <p className="text-xs text-muted-foreground mt-1">
              Production-ready intelligent product discovery platform.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
            <Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>
          </div>
        </div>
        <hr className="my-6 border-border" />
        <div className="text-center text-[10px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Nexus Product Discovery Catalog. Built with PostgreSQL, MongoDB, Spring Boot and React.
        </div>
      </div>
    </footer>
  );
}
