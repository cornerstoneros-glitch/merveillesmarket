const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Admin Products CRUD
export const createProduct = async (productData, token) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création du produit');
  }
  return response.json();
};

export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du produit');
  }
  return response.json();
};

export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du produit');
  }
  return response.json();
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Admin Auth
export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Identifiants invalides');
  }
  return response.json();
};

// Admin Orders
export const fetchOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des commandes');
  }
  return response.json();
};

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du statut');
  }
  return response.json();
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(price);
};

// Settings
export const fetchSettings = async () => {
  const response = await fetch(`${API_URL}/settings`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des paramètres');
  }
  return response.json();
};

export const updateSetting = async (key, value, token) => {
  const response = await fetch(`${API_URL}/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ value })
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du paramètre');
  }
  return response.json();
};

// Coupons
export const validateCoupon = async (code) => {
  const response = await fetch(`${API_URL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Code promo invalide');
  }
  return data;
};

export const fetchCoupons = async (token) => {
  const response = await fetch(`${API_URL}/coupons`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des coupons');
  }
  return response.json();
};

export const createCoupon = async (couponData, token) => {
  const response = await fetch(`${API_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(couponData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de la création du coupon');
  }
  return data;
};

export const deleteCoupon = async (id, token) => {
  const response = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du coupon');
  }
  return response.json();
};
