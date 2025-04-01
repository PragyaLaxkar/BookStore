import axios from 'axios';

// Use environment variable if available, otherwise fallback to relative path
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const bookAPI = {
  getBooks: async (params) => {
    try {
      const response = await api.get('/books', { params });
      // Ensure we always return an array even if the API returns something else
      if (Array.isArray(response.data)) {
        return { data: response.data };
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object but not an array, check if it has a data property that's an array
        if (Array.isArray(response.data.data)) {
          return { data: response.data.data };
        }
        // Otherwise return an empty array to prevent map errors
        console.warn('API returned non-array data for books:', response.data);
        return { data: [] };
      }
      console.warn('Unexpected API response format:', response.data);
      return { data: [] };
    } catch (error) {
      console.error('Error fetching books:', error);
      return { data: [] };
    }
  },
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  addReview: (id, reviewData) => api.post(`/books/${id}/reviews`, reviewData),
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;
