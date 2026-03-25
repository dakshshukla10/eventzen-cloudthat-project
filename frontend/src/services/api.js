import axios from 'axios';

const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth
export const register = (data) => axios.post(`${API_PREFIX}/auth/register`, data);
export const login = (data) => axios.post(`${API_PREFIX}/auth/login`, data);

// Users
export const getUsers = () => axios.get(`${API_PREFIX}/users`, { headers: getAuthHeader() });
export const getUser = (id) => axios.get(`${API_PREFIX}/users/${id}`, { headers: getAuthHeader() });
export const updateUser = (id, data) => axios.put(`${API_PREFIX}/users/${id}`, data, { headers: getAuthHeader() });
export const deleteUser = (id) => axios.delete(`${API_PREFIX}/users/${id}`, { headers: getAuthHeader() });

// Venues
export const getVenues = (params) => axios.get(`${API_PREFIX}/venues`, { params, headers: getAuthHeader() });
export const getVenue = (id) => axios.get(`${API_PREFIX}/venues/${id}`, { headers: getAuthHeader() });
export const getVenueAvailability = (id) => axios.get(`${API_PREFIX}/venues/${id}/availability`, { headers: getAuthHeader() });
export const createVenue = (data) => axios.post(`${API_PREFIX}/venues`, data, { headers: getAuthHeader() });
export const updateVenue = (id, data) => axios.put(`${API_PREFIX}/venues/${id}`, data, { headers: getAuthHeader() });
export const deleteVenue = (id) => axios.delete(`${API_PREFIX}/venues/${id}`, { headers: getAuthHeader() });

// Vendors
export const getVendors = () => axios.get(`${API_PREFIX}/vendors`, { headers: getAuthHeader() });
export const getVendor = (id) => axios.get(`${API_PREFIX}/vendors/${id}`, { headers: getAuthHeader() });
export const createVendor = (data) => axios.post(`${API_PREFIX}/vendors`, data, { headers: getAuthHeader() });
export const updateVendor = (id, data) => axios.put(`${API_PREFIX}/vendors/${id}`, data, { headers: getAuthHeader() });
export const deleteVendor = (id) => axios.delete(`${API_PREFIX}/vendors/${id}`, { headers: getAuthHeader() });

// Events
export const getEvents = () => axios.get(`${API_PREFIX}/events`, { headers: getAuthHeader() });
export const getEvent = (id) => axios.get(`${API_PREFIX}/events/${id}`, { headers: getAuthHeader() });
export const createEvent = (data) => axios.post(`${API_PREFIX}/events`, data, { headers: getAuthHeader() });
export const updateEvent = (id, data) => axios.put(`${API_PREFIX}/events/${id}`, data, { headers: getAuthHeader() });
export const deleteEvent = (id) => axios.delete(`${API_PREFIX}/events/${id}`, { headers: getAuthHeader() });

// Bookings
export const getBookings = (userId) => axios.get(`${API_PREFIX}/bookings`, { params: { userId }, headers: getAuthHeader() });
export const getBooking = (id) => axios.get(`${API_PREFIX}/bookings/${id}`, { headers: getAuthHeader() });
export const createBooking = (data) => axios.post(`${API_PREFIX}/bookings`, data, { headers: getAuthHeader() });
export const cancelBooking = (id) => axios.put(`${API_PREFIX}/bookings/${id}/cancel`, {}, { headers: getAuthHeader() });

// Admin Bookings
export const getAdminBookings = () => axios.get(`${API_PREFIX}/admin/bookings`, { headers: getAuthHeader() });
export const approveBooking = (id) => axios.put(`${API_PREFIX}/admin/bookings/${id}/approve`, {}, { headers: getAuthHeader() });
export const rejectBooking = (id) => axios.put(`${API_PREFIX}/admin/bookings/${id}/reject`, {}, { headers: getAuthHeader() });
