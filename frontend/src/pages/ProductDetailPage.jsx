import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isCartOpen, setIsCartOpen, cartCount } = useCart();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchProductById(id);
      setData(res);
    } catch (err) {
      setError('Product not found or offline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center animate-pulse">Loading...</div>;
  if (error || !data) return <div className="min-h-screen bg-white flex items-center justify-center text-red-500">{error}</div>;

  const { sqlData, mongoData } = data;

  const getImageUrl = (product) => {
    const brand = product.brand?.toLowerCase() || '';
    const cat = product.category?.name?.toLowerCase() || '';
    
    if (cat === 'laptops') return '/images/laptop.png';
    if (cat === 'audio') return '/images/headphones.png';
    
    if (brand === 'apple') return '/images/iphone.png';
    if (brand === 'google') return '/images/pixel.png';
    if (brand === 'samsung') return '/images/samsung.png';
    
    return '/images/iphone.png'; // Fallback
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      <header className="w-full flex items-center justify-between py-6 px-8 border-b border-gray-100 sticky top-0 bg-white z-40">
        <Link to="/" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold hover:text-gray-500 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <button onClick={logout} className="text-[10px] uppercase tracking-[0.15em] font-semibold hover:text-gray-500 transition-colors hidden sm:block">
              Logout
            </button>
          )}
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold hover:text-gray-500 transition-colors">
            <ShoppingBag className="w-3 h-3" /> Cart ({cartCount})
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-12 py-16 flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2">
          <div className="w-full aspect-square bg-[#fcfcfc] rounded-2xl flex items-center justify-center overflow-hidden relative">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={getImageUrl(sqlData)}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600?text=No+Image'; }}
              alt={sqlData.name} 
              className="w-2/3 h-2/3 object-contain"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">{sqlData.brand}</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{sqlData.name}</h1>
          <div className="text-2xl font-light tracking-wide mb-8">${sqlData.price}</div>
          
          <p className="text-sm text-gray-600 leading-relaxed max-w-lg mb-10">
            {mongoData?.description || "No deep description available."}
          </p>

          <div className="flex gap-4 mb-12">
            {sqlData.inStock ? (
              <button 
                onClick={() => addToCart(sqlData.id, 1)}
                className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            ) : (
              <div className="px-6 py-3 bg-gray-200 text-gray-500 text-[10px] uppercase tracking-widest font-semibold cursor-not-allowed">
                Out of Stock
              </div>
            )}
          </div>

          {mongoData?.specs && (
            <div className="border-t border-gray-100 pt-8 mt-8">
              <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-6">Technical Specs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(mongoData.specs).map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-gray-50 pb-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{k}</span>
                    <span className="text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mongoData?.tags && (
            <div className="flex flex-wrap gap-2 mt-8">
              {mongoData.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-gray-100 text-[10px] uppercase tracking-wider text-gray-600 rounded-full">{t}</span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
