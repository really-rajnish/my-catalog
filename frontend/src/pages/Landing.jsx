import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/auth-store';

export default function Landing() {
  const { isAuthenticated, username } = useAuthStore();
  // State for the "Lights On/Off" room toggle
  const [lightsOn, setLightsOn] = useState(true);

  // Only smartphones
  const products = [
    { id: 1, name: "Google Pixel 8 Pro", price: "$999", img: "/images/pixel.png" },
    { id: 2, name: "Apple iPhone 15 Pro", price: "$1,199", img: "/images/iphone.png" },
    { id: 3, name: "Samsung Galaxy S24 Ultra", price: "$1,299", img: "/images/samsung.png" },
    { id: 4, name: "Google Pixel 8", price: "$699", img: "/images/pixel.png" },
    { id: 5, name: "Apple iPhone 15", price: "$799", img: "/images/iphone.png" },
    { id: 6, name: "Samsung Galaxy S24", price: "$799", img: "/images/samsung.png" },
    { id: 7, name: "Google Pixel Fold", price: "$1,799", img: "/images/pixel.png" },
    { id: 8, name: "Apple iPhone 15 Plus", price: "$899", img: "/images/iphone.png" }
  ];

  // Dynamic classes for the dark/light room toggle
  const bgClass = lightsOn ? "bg-white" : "bg-[#111111]";
  const textClass = lightsOn ? "text-black" : "text-white";
  const borderClass = lightsOn ? "border-gray-100" : "border-[#222]";
  const mutedTextClass = lightsOn ? "text-gray-400" : "text-gray-500";
  const hoverTextClass = lightsOn ? "hover:text-gray-500" : "hover:text-gray-300";
  const cardBgClass = lightsOn ? "bg-[#fcfcfc]" : "bg-[#1a1a1a]";

  return (
    <div className={`${bgClass} ${textClass} min-h-screen font-sans selection:bg-current selection:text-background transition-colors duration-700 pb-32`}>
      {/* Top Navbar */}
      <header className={`w-full flex justify-between items-center py-6 px-8 border-b ${borderClass} sticky top-0 ${bgClass} z-50 transition-colors duration-700`}>
        <div className="flex items-center gap-8 sm:gap-12 text-[10px] uppercase tracking-[0.15em] font-semibold">
          <Link to="#" className={`${hoverTextClass} transition-colors`}>Phones</Link>
          <Link to="#" className={`${hoverTextClass} transition-colors hidden sm:block`}>Collections</Link>
          <Link to="#" className={`${hoverTextClass} transition-colors hidden sm:block`}>Objects</Link>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-medium tracking-[0.2em] uppercase text-sm sm:text-base">
          Nexus
        </div>

        <div className="flex items-center gap-8 sm:gap-12 text-[10px] uppercase tracking-[0.15em] font-semibold">
          {isAuthenticated ? (
            <span className={`${mutedTextClass} hidden sm:block`}>Account: {username}</span>
          ) : (
            <Link to="/login" className={`${hoverTextClass} transition-colors hidden sm:block`}>Log In</Link>
          )}
          <Link to="/catalog" className={`${hoverTextClass} transition-colors`}>Cart (0)</Link>
        </div>
      </header>

      <main className="w-full px-4 sm:px-12 py-12 max-w-[2000px] mx-auto">
        
        {/* Controls Section (Filters & Toggle) */}
        <div className="flex justify-between items-center mb-12 text-[10px] uppercase tracking-[0.15em] font-semibold">
          <div className="flex gap-6">
            <button className={`${textClass} border-b ${lightsOn ? 'border-black' : 'border-white'} pb-1 ${hoverTextClass} transition-colors`}>All Phones</button>
          </div>
          
          {/* Light Switch Toggle */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setLightsOn(!lightsOn)}>
            <span className={`${mutedTextClass} hidden sm:block`}>Room Lights:</span>
            <div className={`w-10 h-5 rounded-full p-1 flex items-center transition-colors duration-300 ${lightsOn ? 'bg-gray-200' : 'bg-gray-700'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${lightsOn ? 'translate-x-0' : 'translate-x-4.5'}`} />
            </div>
            <span className={`${textClass}`}>{lightsOn ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        {/* Small Aesthetic Product Grid (4 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className={`w-full overflow-hidden mb-5 ${cardBgClass} aspect-[4/5] transition-colors duration-700 relative`}>
                {/* Simulated Glow when room is dark */}
                {!lightsOn && (
                  <div className="absolute inset-0 bg-[#ea580c] opacity-10 blur-2xl z-0 pointer-events-none mix-blend-screen" />
                )}
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className={`w-full h-full object-contain p-8 transition-all duration-[2s] ease-out group-hover:scale-105 relative z-10 ${!lightsOn && 'brightness-125 contrast-125 saturate-50'}`} 
                />
              </div>
              <div className="flex flex-col gap-1.5 px-1">
                <span className={`text-[10px] uppercase tracking-[0.1em] font-semibold ${textClass} transition-colors duration-700`}>{product.name}</span>
                <span className={`text-[10px] ${mutedTextClass} tracking-wider transition-colors duration-700`}>{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
