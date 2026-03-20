import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/api';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Events</h1>
        <p>Browse upcoming events and book your spot</p>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events available</h3>
          <p>Check back soon for new events!</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card">
              <div className="event-card-body">
                <div className="event-card-top">
                  <h3>{event.name}</h3>
                  <span className={`badge badge-${event.status?.toLowerCase()}`}>{event.status}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span>{event.date}</span>
                  {event.maxAttendees && <span>Max: {event.maxAttendees}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
