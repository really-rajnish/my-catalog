import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
if (API_BASE_URL && !API_BASE_URL.startsWith('http') && !API_BASE_URL.startsWith('/')) {
  API_BASE_URL = `https://${API_BASE_URL}`;
}
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth Interceptors Below ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Catalog API ---
export const fetchProducts = async (page = 0, size = 10, sortBy = 'newest') => {
  const res = await api.get('/products', { params: { page, size, sortBy } });
  return res.data;
};

export const filterProducts = async (filterRequest, page = 0, size = 10) => {
  const res = await api.post('/products/filter', filterRequest, { params: { page, size } });
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const keywordSearch = async (q, page = 0, size = 10) => {
  const res = await api.get('/search/keyword', { params: { q, page, size } });
  return res.data;
};

export const semanticSearch = async (q, limit = 10) => {
  const res = await api.get('/search/semantic', { params: { q, limit } });
  return res.data;
};

// --- Product CRUD API ---
export const createProduct = async (productData) => {
  const res = await api.post('/products', productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
