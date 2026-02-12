const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// loader callback will be set by LoaderContextProvider during initialization
let _setLoader = () => {};
export const setApiLoader = (fn) => {
  _setLoader = fn;
};

// helper to wrap fetch calls and automatically manage loader
const request = async (url, options = {}) => {
  _setLoader(true);
  try {
    // add auth header if token present
    const stored = localStorage.getItem('user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'API request failed');
    }
    return response.json();
  } finally {
    _setLoader(false);
  }
};

// Product APIs
export const productAPI = {
  getAll: async () => request(`${API_BASE_URL}/products`),

  getById: async (id) => request(`${API_BASE_URL}/products/${id}`),

  create: async (productData) =>
    request(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }),

  update: async (id, productData) =>
    request(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }),

  delete: async (id) =>
    request(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    }),

  getLowStock: async () => request(`${API_BASE_URL}/products/low-stock`),

  getCategories: async () => request(`${API_BASE_URL}/products/categories/list`),
};

// Bill APIs
export const authAPI = {
  register: async (data) =>
    request(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  login: async (data) =>
    request(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

export const companyAPI = {
  getAll: async () => request(`${API_BASE_URL}/company`),
  getById: async (id) => request(`${API_BASE_URL}/company/${id}`),
  create: async (data) =>
    request(`${API_BASE_URL}/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: async (id, data) =>
    request(`${API_BASE_URL}/company/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: async (id) =>
    request(`${API_BASE_URL}/company/${id}`, {
      method: 'DELETE',
    }),
};

export const userAPI = {
  getProfile: async () => request(`${API_BASE_URL}/users/profile`),
  updateProfile: async (data) =>
    request(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  changePassword: async (currentPassword, newPassword) =>
    request(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const billAPI = {
  getAll: async () => request(`${API_BASE_URL}/bills`),

  getPending: async () => request(`${API_BASE_URL}/bills/pending/list`),

  getById: async (id) => request(`${API_BASE_URL}/bills/${id}`),

  create: async (billData) =>
    request(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    }),

  updateStatus: async (id, status) =>
    request(`${API_BASE_URL}/bills/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),

  delete: async (id) =>
    request(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
    }),

  getStats: async () => request(`${API_BASE_URL}/bills/stats/dashboard`),

  getSalesReport: async () => request(`${API_BASE_URL}/bills/report/sales`),

  getUdhaarReport: async () => request(`${API_BASE_URL}/bills/report/udhaar`),

  getStockReport: async () => request(`${API_BASE_URL}/bills/report/stock`),

  getCategorySalesReport: async () =>
    request(`${API_BASE_URL}/bills/report/category-sales`),
};
