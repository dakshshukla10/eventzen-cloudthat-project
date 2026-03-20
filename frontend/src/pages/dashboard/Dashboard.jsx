import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEvents, getVenues, getBookings, getAdminBookings } from '../../services/api';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ events: 0, venues: 0, bookings: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [eventsRes, venuesRes] = await Promise.all([getEvents(), getVenues()]);
      setRecentEvents(eventsRes.data.slice(0, 5));
      let bookingsRes;
      if (isAdmin()) {
        bookingsRes = await getAdminBookings();
      } else {
        bookingsRes = await getBookings(user.id);
      }
      setRecentBookings(bookingsRes.data.slice(0, 5));
      setStats({
        events: eventsRes.data.length,
        venues: venuesRes.data.length,
        bookings: bookingsRes.data.length,
      });
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p className="dashboard-role">{isAdmin() ? 'Administrator' : 'Customer'} Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.events}</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.venues}</div>
          <div className="stat-label">Venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.bookings}</div>
          <div className="stat-label">{isAdmin() ? 'All Bookings' : 'My Bookings'}</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Events</h2>
            <Link to="/events" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {recentEvents.length === 0 ? (
            <p className="empty-text">No events yet.</p>
          ) : (
            <div className="list-compact">
              {recentEvents.map((event) => (
                <div key={event.id} className="list-item-compact">
                  <div>
                    <strong>{event.name}</strong>
                    <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
                  </div>
                  <span className="text-muted">{event.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <Link to={isAdmin() ? '/admin' : '/bookings'} className="btn btn-outline btn-sm">View All</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="empty-text">No bookings yet.</p>
          ) : (
            <div className="list-compact">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="list-item-compact">
                  <div>
                    <strong>Booking #{booking.id}</strong>
                    <span className={`badge badge-${booking.status?.toLowerCase()}`}>{booking.status}</span>
                  </div>
                  <span className="text-muted">{booking.bookingDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAdmin() && (
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin" className="action-card">Manage Bookings</Link>
            <Link to="/admin/venues" className="action-card">Manage Venues</Link>
            <Link to="/admin/events" className="action-card">Manage Events</Link>
            <Link to="/admin/vendors" className="action-card">Manage Vendors</Link>
          </div>
        </div>
      )}
    </div>
  );
}
