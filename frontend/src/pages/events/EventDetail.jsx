import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, createBooking } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const res = await getEvent(id);
      setEvent(res.data);
    } catch (err) {
      console.error('Failed to load event', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setBooking(true);
    setMessage('');
    try {
      await createBooking({
        eventId: event.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      setMessage('Booking request submitted! Awaiting admin approval.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (!event) return <div className="empty-state"><h3>Event not found</h3></div>;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>Back</button>
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>{event.name}</h1>
            <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-info-grid">
            <div className="detail-info">
              <label>Date</label>
              <span>{event.date}</span>
            </div>
            <div className="detail-info">
              <label>Venue ID</label>
              <span>{event.venueId || 'N/A'}</span>
            </div>
            {event.maxAttendees && (
              <div className="detail-info">
                <label>Max Attendees</label>
                <span>{event.maxAttendees}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="detail-section">
              <h3>About this Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          {message && (
            <div className={`alert ${message.includes('failed') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

          {!isAdmin() && event.status === 'UPCOMING' && (
            <button className="btn btn-primary" onClick={handleBook} disabled={booking}>
              {booking ? 'Booking...' : 'Book This Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
