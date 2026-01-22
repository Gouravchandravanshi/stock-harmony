const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Product APIs
export const productAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  update: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  getLowStock: async () => {
    const response = await fetch(`${API_BASE_URL}/products/low-stock`);
    if (!response.ok) throw new Error('Failed to fetch low stock products');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/categories/list`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
};

// Bill APIs
export const billAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bills`);
    if (!response.ok) throw new Error('Failed to fetch bills');
    return response.json();
  },

  getPending: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/pending/list`);
    if (!response.ok) throw new Error('Failed to fetch pending bills');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bill');
    return response.json();
  },

  create: async (billData) => {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    });
    if (!response.ok) throw new Error('Failed to create bill');
    return response.json();
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update bill status');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete bill');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/stats/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch bill stats');
    return response.json();
  },

  getSalesReport: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/report/sales`);
    if (!response.ok) throw new Error('Failed to fetch sales report');
    return response.json();
  },

  getUdhaarReport: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/report/udhaar`);
    if (!response.ok) throw new Error('Failed to fetch udhaar report');
    return response.json();
  },

  getStockReport: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/report/stock`);
    if (!response.ok) throw new Error('Failed to fetch stock report');
    return response.json();
  },

  getCategorySalesReport: async () => {
    const response = await fetch(`${API_BASE_URL}/bills/report/category-sales`);
    if (!response.ok) throw new Error('Failed to fetch category sales report');
    return response.json();
  },
};
