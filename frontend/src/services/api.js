import axios from 'axios';

const USER_API = 'http://localhost:8081';
const VENUE_API = 'http://localhost:8082';
const EVENT_API = 'http://localhost:8083';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth
export const register = (data) => axios.post(`${USER_API}/auth/register`, data);
export const login = (data) => axios.post(`${USER_API}/auth/login`, data);

// Users
export const getUsers = () => axios.get(`${USER_API}/users`, { headers: getAuthHeader() });
export const getUser = (id) => axios.get(`${USER_API}/users/${id}`, { headers: getAuthHeader() });
export const updateUser = (id, data) => axios.put(`${USER_API}/users/${id}`, data, { headers: getAuthHeader() });
export const deleteUser = (id) => axios.delete(`${USER_API}/users/${id}`, { headers: getAuthHeader() });

// Venues
export const getVenues = (params) => axios.get(`${VENUE_API}/venues`, { params, headers: getAuthHeader() });
export const getVenue = (id) => axios.get(`${VENUE_API}/venues/${id}`, { headers: getAuthHeader() });
export const getVenueAvailability = (id) => axios.get(`${VENUE_API}/venues/${id}/availability`, { headers: getAuthHeader() });
export const createVenue = (data) => axios.post(`${VENUE_API}/venues`, data, { headers: getAuthHeader() });
export const updateVenue = (id, data) => axios.put(`${VENUE_API}/venues/${id}`, data, { headers: getAuthHeader() });
export const deleteVenue = (id) => axios.delete(`${VENUE_API}/venues/${id}`, { headers: getAuthHeader() });

// Vendors
export const getVendors = () => axios.get(`${VENUE_API}/vendors`, { headers: getAuthHeader() });
export const getVendor = (id) => axios.get(`${VENUE_API}/vendors/${id}`, { headers: getAuthHeader() });
export const createVendor = (data) => axios.post(`${VENUE_API}/vendors`, data, { headers: getAuthHeader() });
export const updateVendor = (id, data) => axios.put(`${VENUE_API}/vendors/${id}`, data, { headers: getAuthHeader() });
export const deleteVendor = (id) => axios.delete(`${VENUE_API}/vendors/${id}`, { headers: getAuthHeader() });

// Events
export const getEvents = () => axios.get(`${EVENT_API}/events`, { headers: getAuthHeader() });
export const getEvent = (id) => axios.get(`${EVENT_API}/events/${id}`, { headers: getAuthHeader() });
export const createEvent = (data) => axios.post(`${EVENT_API}/events`, data, { headers: getAuthHeader() });
export const updateEvent = (id, data) => axios.put(`${EVENT_API}/events/${id}`, data, { headers: getAuthHeader() });
export const deleteEvent = (id) => axios.delete(`${EVENT_API}/events/${id}`, { headers: getAuthHeader() });

// Bookings
export const getBookings = (userId) => axios.get(`${EVENT_API}/bookings`, { params: { userId }, headers: getAuthHeader() });
export const getBooking = (id) => axios.get(`${EVENT_API}/bookings/${id}`, { headers: getAuthHeader() });
export const createBooking = (data) => axios.post(`${EVENT_API}/bookings`, data, { headers: getAuthHeader() });
export const cancelBooking = (id) => axios.put(`${EVENT_API}/bookings/${id}/cancel`, {}, { headers: getAuthHeader() });

// Admin Bookings
export const getAdminBookings = () => axios.get(`${EVENT_API}/admin/bookings`, { headers: getAuthHeader() });
export const approveBooking = (id) => axios.put(`${EVENT_API}/admin/bookings/${id}/approve`, {}, { headers: getAuthHeader() });
export const rejectBooking = (id) => axios.put(`${EVENT_API}/admin/bookings/${id}/reject`, {}, { headers: getAuthHeader() });
