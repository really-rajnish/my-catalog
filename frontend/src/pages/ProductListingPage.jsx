import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { filterProducts, fetchCategories } from '../services/api';
import { Search, Sparkles } from 'lucide-react';

export default function ProductListingPage() {
  const { isAuthenticated, email, role, logout } = useAuth();
  const { state, dispatch } = useCatalog();
  const [lightsOn, setLightsOn] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const bgClass = lightsOn ? "bg-white" : "bg-[#111111]";
  const textClass = lightsOn ? "text-black" : "text-white";
  const borderClass = lightsOn ? "border-gray-100" : "border-[#222]";
  const mutedTextClass = lightsOn ? "text-gray-400" : "text-gray-500";
  const hoverTextClass = lightsOn ? "hover:text-gray-500" : "hover:text-gray-300";
  const cardBgClass = lightsOn ? "bg-[#fcfcfc]" : "bg-[#1a1a1a]";

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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [state.filters, page]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await filterProducts(state.filters, page, 10);
      dispatch({ type: 'SET_PRODUCTS', payload: page === 0 ? data.content : [...state.products, ...data.content] });
      setTotalPages(data.totalPages);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
    }
  };

  const handleFilterChange = (key, value) => {
    setPage(0);
    dispatch({ type: 'UPDATE_FILTERS', payload: { [key]: value } });
  };

  return (
    <div className={`${bgClass} ${textClass} min-h-screen font-sans selection:bg-current selection:text-background transition-colors duration-700 pb-32`}>
      <header className={`w-full flex justify-between items-center py-6 px-8 border-b ${borderClass} sticky top-0 ${bgClass} z-40 transition-colors duration-700`}>
        <div className="flex items-center gap-8 sm:gap-12 text-[10px] uppercase tracking-[0.15em] font-semibold">
          <Link to="/" className={`${hoverTextClass} transition-colors`}>Phones</Link>
          <Link to="/search" className={`${hoverTextClass} transition-colors hidden sm:block flex items-center gap-1`}><Search className="w-3 h-3"/> Search</Link>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-medium tracking-[0.2em] uppercase text-sm sm:text-base">
          Nexus
        </div>

        <div className="flex items-center gap-8 sm:gap-12 text-[10px] uppercase tracking-[0.15em] font-semibold">
          {isAuthenticated ? (
            <div className="flex items-center gap-6 hidden sm:flex">
              {role === 'ADMIN' && (
                <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors">Admin Dashboard</Link>
              )}
              <span className={mutedTextClass}>Account: {email}</span>
              <button onClick={logout} className={`${hoverTextClass} transition-colors uppercase`}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className={`${hoverTextClass} transition-colors hidden sm:block`}>Log In</Link>
          )}
        </div>
      </header>

      <main className="w-full px-4 sm:px-12 py-12 max-w-[2000px] mx-auto flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8 sticky top-24 h-fit">
          <div className="flex items-center gap-4 cursor-pointer mb-8" onClick={() => setLightsOn(!lightsOn)}>
            <span className={`${mutedTextClass} text-[10px] uppercase tracking-[0.15em] font-semibold`}>Room Lights:</span>
            <div className={`w-10 h-5 rounded-full p-1 flex items-center transition-colors duration-300 ${lightsOn ? 'bg-gray-200' : 'bg-gray-700'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${lightsOn ? 'translate-x-0' : 'translate-x-4.5'}`} />
            </div>
            <span className={`text-[10px] font-semibold tracking-wider ${textClass}`}>{lightsOn ? 'ON' : 'OFF'}</span>
          </div>

          <div>
            <h3 className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${mutedTextClass} mb-4`}>Category</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleFilterChange('categoryId', null)}
                className={`text-left text-sm ${!state.filters.categoryId ? textClass : mutedTextClass} ${hoverTextClass}`}
              >
                All
              </button>
              {state.categories.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleFilterChange('categoryId', c.id)}
                  className={`text-left text-sm ${state.filters.categoryId === c.id ? textClass : mutedTextClass} ${hoverTextClass}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${mutedTextClass} mb-4`}>Filter</h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={state.filters.inStockOnly}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                className="rounded border-gray-300"
              />
              In stock only
            </label>
          </div>

          <div>
             <h3 className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${mutedTextClass} mb-4`}>Sort</h3>
             <select 
               className={`w-full bg-transparent border-b ${borderClass} pb-2 text-sm focus:outline-none`}
               value={state.filters.sortBy}
               onChange={(e) => handleFilterChange('sortBy', e.target.value)}
             >
               <option className="text-black" value="newest">Newest</option>
               <option className="text-black" value="price_asc">Price: Low to High</option>
               <option className="text-black" value="price_desc">Price: High to Low</option>
               <option className="text-black" value="name_asc">Name: A-Z</option>
             </select>
          </div>
        </aside>

        <div className="flex-1">
          {state.error && <div className="text-red-500 mb-4">{state.error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {state.products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 10) * 0.05 }}
                className="group cursor-pointer flex flex-col"
              >
                <Link to={`/product/${product.id}`}>
                  <div className={`w-full overflow-hidden mb-5 ${cardBgClass} aspect-[4/5] transition-colors duration-700 relative`}>
                    {!lightsOn && (
                      <div className="absolute inset-0 bg-[#ea580c] opacity-10 blur-2xl z-0 pointer-events-none mix-blend-screen" />
                    )}
                    <img 
                      src={getImageUrl(product)}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
                      alt={product.name} 
                      className={`w-full h-full object-contain p-8 transition-all duration-[2s] ease-out group-hover:scale-105 relative z-10 ${!lightsOn && 'brightness-125 contrast-125 saturate-50'}`} 
                    />
                    {!product.inStock && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] px-2 py-1 uppercase tracking-wider z-20">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 px-1">
                    <span className={`text-[10px] uppercase tracking-[0.1em] font-semibold ${textClass} transition-colors duration-700`}>{product.name}</span>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] ${mutedTextClass} tracking-wider transition-colors duration-700`}>${product.price}</span>
                      <span className={`text-[10px] uppercase text-gray-500 tracking-wider`}>{product.brand}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {state.loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 mt-16 opacity-50 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className={`w-full ${cardBgClass} aspect-[4/5] rounded-lg`} />
              ))}
            </div>
          )}

          {!state.loading && state.products.length === 0 && (
            <div className="py-32 text-center text-gray-500 flex flex-col items-center">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-xl tracking-widest uppercase">No objects found</p>
            </div>
          )}

          {!state.loading && page < totalPages - 1 && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setPage(p => p + 1)}
                className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${textClass} border-b ${borderClass} pb-1 hover:text-gray-500 transition-colors`}
              >
                Load More Objects
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
