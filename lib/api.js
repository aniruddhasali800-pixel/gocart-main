/**
 * lib/api.js
 * Central API client for GoCart frontend.
 * Automatically attaches Clerk auth token to every authenticated request.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gocart-main-4.onrender.com';

/**
 * Get the Clerk session token from the window.__clerk__ object.
 * Works in browser context with @clerk/nextjs installed.
 */
async function getAuthToken() {
    try {
        if (typeof window !== 'undefined' && window.Clerk) {
            const token = await window.Clerk.session?.getToken();
            return token || null;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Get the admin JWT token from localStorage.
 */
function getAdminToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken') || null;
    }
    return null;
}

/**
 * Core fetch wrapper.
 * @param {string} endpoint - API path e.g. '/api/products'
 * @param {RequestInit} options - fetch options
 * @param {boolean} auth - attach auth token if true
 * @param {boolean} adminAuth - attach admin JWT token if true
 */
async function apiFetch(endpoint, options = {}, auth = false, adminAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (adminAuth) {
        const adminToken = getAdminToken();
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (auth) {
        const token = await getAuthToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
}

// ─── Public endpoints ──────────────────────────────────────────

export const api = {
    // Products
    getProducts: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/api/products${query ? `?${query}` : ''}`);
    },
    getProduct: (id) => apiFetch(`/api/products/${id}`),

    // Auth endpoints
    getAddresses: () => apiFetch('/api/addresses', {}, true),
    addAddress: (data) => apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(data) }, true),
    deleteAddress: (id) => apiFetch(`/api/addresses/${id}`, { method: 'DELETE' }, true),

    verifyCoupon: (code) => apiFetch('/api/coupons/verify', { method: 'POST', body: JSON.stringify({ code }) }, true),

    placeOrder: (data) => apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(data) }, true),
    getUserOrders: () => apiFetch('/api/orders/user', {}, true),

    // Store
    getMyStore: () => apiFetch('/api/stores/me', {}, true),
    createStore: (data) => apiFetch('/api/stores', { method: 'POST', body: JSON.stringify(data) }, true),
    updateStore: (data) => apiFetch('/api/stores/me', { method: 'PATCH', body: JSON.stringify(data) }, true),

    // Seller
    getSellerDashboard: () => apiFetch('/api/admin/dashboard', {}, false, true),
    addProduct: (data) => apiFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }, false, true),
    getStoreProducts: () => apiFetch('/api/admin/products', {}, false, true),
    toggleStock: (id) => apiFetch(`/api/admin/products/${id}/toggle-stock`, { method: 'PATCH' }, false, true),
    deleteProduct: (id) => apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' }, false, true),
    getStoreOrders: () => apiFetch('/api/admin/orders', {}, false, true),
    updateOrderStatus: (id, status) => apiFetch(`/api/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, false, true),
    updateOrderTracking: (id, data) => apiFetch(`/api/admin/orders/${id}/tracking`, { method: 'PATCH', body: JSON.stringify(data) }, false, true),
    createSellerCoupon: (data) => apiFetch('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }, false, true),

    // Admin  (use admin JWT token, not Clerk)
    getAdminDashboard: () => apiFetch('/api/admin/dashboard', {}, false, true),
    getAdminOrders:    () => apiFetch('/api/admin/orders',    {}, false, true),
    getAllStores:       () => apiFetch('/api/stores',          {}, false, true),
    approveStore: (id, status) => apiFetch(`/api/stores/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ status }) }, false, true),
    getAllCoupons:  () => apiFetch('/api/coupons',     {}, false, true),
    createCoupon: (data) => apiFetch('/api/coupons',  { method: 'POST', body: JSON.stringify(data) }, false, true),
    deleteCoupon: (id)   => apiFetch(`/api/coupons/${id}`, { method: 'DELETE' }, false, true),
    updateCommission: (storeId, commissionRate) => apiFetch(
        `/api/stores/${storeId}/commission`,
        { method: 'PATCH', body: JSON.stringify({ commissionRate }) },
        false, true
    ),
    updateCustomize: (data) => apiFetch('/api/customize', { method: 'PUT', body: JSON.stringify(data) }, false, true),

    // Public Settings
    getCustomize: () => apiFetch('/api/customize'),

    // Admin — User Analytics
    getUsersAnalytics:    ()       => apiFetch('/api/admin/users/analytics', {}, false, true),
    getUserAnalytics:     (userId) => apiFetch(`/api/admin/users/${userId}/analytics`, {}, false, true),

    // Notifications
    getNotifications: () => apiFetch('/api/notifications', {}, true),
    markNotificationRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }, true),

    // Upload
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        // Use standard fetch without JSON headers for FormData
        const token = await getAuthToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${BASE_URL}/api/upload`, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};

export default api;
