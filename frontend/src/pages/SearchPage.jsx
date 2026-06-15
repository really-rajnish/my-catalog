import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { keywordSearch, semanticSearch } from '../services/api';
import { Search, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('keyword'); // 'keyword' | 'semantic'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'keyword') {
        const data = await keywordSearch(query);
        setResults(data);
      } else {
        const data = await semanticSearch(query);
        setResults(data);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-run search when tab changes if there's a query
  React.useEffect(() => {
    if (query.trim()) handleSearch();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      <header className="w-full flex items-center py-6 px-8 border-b border-gray-100 sticky top-0 bg-white z-40">
        <Link to="/" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold hover:text-gray-500 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Catalog
        </Link>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center">
        
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mb-8">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: affordable gaming laptop, best camera..."
            className="w-full text-2xl sm:text-4xl font-light tracking-tight border-b-2 border-black pb-4 focus:outline-none bg-transparent placeholder-gray-300"
          />
          <button type="submit" className="absolute right-0 bottom-4 text-black hover:text-gray-500 transition-colors">
            <Search className="w-8 h-8" />
          </button>
        </form>

        <div className="flex gap-8 mb-16 text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400">
          <button 
            onClick={() => setActiveTab('keyword')}
            className={`pb-2 border-b-2 transition-colors ${activeTab === 'keyword' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
          >
            Keyword Search
          </button>
          <button 
            onClick={() => setActiveTab('semantic')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'semantic' ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
          >
            <Sparkles className="w-3 h-3" /> Smart Search (AI)
          </button>
        </div>

        {error && <div className="text-red-500 mb-8">{error}</div>}

        {loading && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 opacity-50 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="w-full aspect-[4/5] bg-gray-50 rounded-lg" />
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="w-full">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Query took {results[0].timeTakenMs}ms
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {results.map((res, index) => {
                const product = res.product;
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group cursor-pointer flex flex-col relative"
                  >
                    <div className="absolute top-4 right-4 z-20 bg-black/5 text-black text-[9px] px-2 py-1 uppercase tracking-widest backdrop-blur-md font-bold">
                      {res.matchType} {res.score ? `(${(res.score * 100).toFixed(0)}%)` : ''}
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <div className="w-full overflow-hidden mb-5 bg-[#fcfcfc] aspect-[4/5] relative">
                        <img 
                          src={`/images/${product.brand.toLowerCase()}.png`}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
                          alt={product.name} 
                          className="w-full h-full object-contain p-8 transition-all duration-[2s] ease-out group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 px-1">
                        <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-black">{product.name}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] text-gray-400 tracking-wider">${product.price}</span>
                          <span className="text-[10px] uppercase text-gray-500 tracking-wider">{product.brand}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="py-32 text-center text-gray-400 flex flex-col items-center">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm tracking-widest uppercase">No results found for "{query}"</p>
          </div>
        )}

      </main>
    </div>
  );
}
