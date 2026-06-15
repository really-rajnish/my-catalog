import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Package, Activity, Trash2, Edit3, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function AdminDashboard() {
    const { email, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'activity') {
                const res = await api.get('/admin/logins');
                setActivities(res.data);
            } else if (activeTab === 'products') {
                const res = await api.get('/products?size=100');
                setProducts(res.data.content);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', brand: '', price: 0, discountPrice: 0, inStock: true, stockCount: 0, description: ''
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', brand: '', price: 0, discountPrice: 0, inStock: true, stockCount: 0, description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingProduct(p);
        setFormData({
            name: p.name || '',
            brand: p.brand || '',
            price: p.price || 0,
            discountPrice: p.discountPrice || 0,
            inStock: p.inStock ?? true,
            stockCount: p.stockCount || 0,
            description: p.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                sqlData: {
                    name: formData.name,
                    brand: formData.brand,
                    price: formData.price,
                    discountPrice: formData.discountPrice,
                    inStock: formData.inStock,
                    stockCount: formData.stockCount,
                    category: null
                },
                mongoData: {
                    description: formData.description,
                    specs: {},
                    tags: []
                }
            };

            if (editingProduct) {
                await api.updateProduct(editingProduct.id, payload);
            } else {
                await api.createProduct(payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save product", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white font-sans flex pb-32">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#222] p-8 flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white">Admin Nexus</span>
                </div>
                
                <nav className="flex flex-col gap-2 mt-8">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'users' ? 'bg-[#222] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4" /> Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'products' ? 'bg-[#222] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Package className="w-4 h-4" /> Products
                    </button>
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'activity' ? 'bg-[#222] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Activity className="w-4 h-4" /> Login Activity
                    </button>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-400 transition-colors mt-auto"
                    >
                        <ShieldAlert className="w-4 h-4" /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
                        <p className="text-sm text-gray-400 mt-2">Manage the catalog data and user security context.</p>
                    </div>
                    {activeTab === 'products' && (
                        <button onClick={openCreateModal} className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors">
                            <Plus className="w-3 h-3" /> New Product
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-full h-16 bg-[#1a1a1a] rounded" />)}
                    </div>
                ) : (
                    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#222]">
                        {activeTab === 'users' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-[#222]">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-[#222] last:border-0 hover:bg-[#222] transition-colors">
                                            <td className="px-6 py-4">{u.id}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 bg-[#111] border border-[#333] rounded text-[10px]">{u.role}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-400 p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'activity' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-[#222]">
                                    <tr>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">IP Address</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map(a => (
                                        <tr key={a.id} className="border-b border-[#222] last:border-0 hover:bg-[#222] transition-colors">
                                            <td className="px-6 py-4 text-gray-400">{new Date(a.loginTime).toLocaleString()}</td>
                                            <td className="px-6 py-4">{a.email}</td>
                                            <td className="px-6 py-4 text-gray-400">{a.ipAddress}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 border rounded text-[10px] ${a.status.includes('SUCCESS') ? 'text-green-400 border-green-900 bg-green-900/20' : 'text-red-400 border-red-900 bg-red-900/20'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'products' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-[#222]">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Brand</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className="border-b border-[#222] last:border-0 hover:bg-[#222] transition-colors">
                                            <td className="px-6 py-4">{p.id}</td>
                                            <td className="px-6 py-4 font-medium">{p.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{p.brand}</td>
                                            <td className="px-6 py-4">${p.price}</td>
                                            <td className="px-6 py-4">
                                                {p.inStock ? <span className="text-green-500">{p.stockCount}</span> : <span className="text-red-500">Out</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-white p-2" onClick={() => openEditModal(p)}>
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-500 hover:text-red-400 p-2" onClick={() => deleteProduct(p.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a] p-8 border border-[#333] w-full max-w-lg">
                        <h3 className="text-xl font-light mb-6">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-[#333] px-4 py-2 text-sm focus:border-white outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Brand</label>
                                    <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-[#111] border border-[#333] px-4 py-2 text-sm focus:border-white outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Price</label>
                                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-[#111] border border-[#333] px-4 py-2 text-sm focus:border-white outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Stock Count</label>
                                    <input required type="number" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: parseInt(e.target.value)})} className="w-full bg-[#111] border border-[#333] px-4 py-2 text-sm focus:border-white outline-none" />
                                </div>
                                <div className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} />
                                    <span className="text-sm">In Stock</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#111] border border-[#333] px-4 py-2 text-sm focus:border-white outline-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-[#333]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 text-sm bg-white text-black font-semibold hover:bg-gray-200">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
