import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [] });
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCart(res.data);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            alert("Please log in to add items to your cart.");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/cart/items', { productId, quantity });
            setCart(res.data);
            setIsCartOpen(true);
        } catch (err) {
            console.error("Failed to add to cart", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            const res = await api.delete(`/cart/items/${itemId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to remove from cart", err);
        } finally {
            setLoading(false);
        }
    };

    const cartTotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal, cartCount, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
