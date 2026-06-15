import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, loading } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black z-50 cursor-pointer"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white text-black z-50 shadow-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold">Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <span className="text-[10px] uppercase tracking-widest">Cart is empty</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                                            <div className="w-20 h-24 bg-[#fcfcfc] rounded flex items-center justify-center p-2">
                                                <img 
                                                    src={`/images/${item.product.category?.name?.toLowerCase() === 'laptops' ? 'laptop' : item.product.category?.name?.toLowerCase() === 'audio' ? 'headphones' : item.product.brand?.toLowerCase() === 'apple' ? 'iphone' : item.product.brand?.toLowerCase() === 'google' ? 'pixel' : item.product.brand?.toLowerCase() === 'samsung' ? 'samsung' : 'iphone'}.png`}
                                                    className="max-h-full max-w-full object-contain"
                                                    alt={item.product.name}
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.product.brand}</div>
                                                    <div className="text-sm font-medium leading-tight">{item.product.name}</div>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="text-sm font-semibold">${item.product.price} <span className="text-gray-400 font-normal text-xs ml-1">x {item.quantity}</span></div>
                                                    <button onClick={() => removeFromCart(item.id)} disabled={loading} className="text-red-500 hover:text-red-700 p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-[#fcfcfc]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Total</span>
                                    <span className="text-xl font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-gray-800 transition-colors">
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
