import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
            {/* Some pages like ProductListingPage have their own navbars for aesthetic, but we can keep Navbar globally if needed. 
                Wait, ProductListingPage has its own header. Let's just remove Navbar from global if it conflicts, or just let it render.
                Actually, Navbar is the global one. Let's render it except on the main listing page. 
                For simplicity, let's just keep Navbar everywhere or remove it. 
                Wait, the prompt asked to "keep the design theme and ui same". ProductListingPage has the sticky header.
                We'll comment out the global Navbar so it doesn't double-render headers. */}
            {/* <Navbar /> */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
              <CartDrawer />
            </main>
            {/* <Footer /> */}
            </BrowserRouter>
          </QueryClientProvider>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
