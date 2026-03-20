import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emptyEvent = { name: '', description: '', date: '', venueId: '', maxAttendees: '', status: 'UPCOMING' };

export default function ManageEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      venueId: form.venueId ? parseInt(form.venueId) : null,
      maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
      organizerId: user.id,
    };
    try {
      if (editing) {
        await updateEvent(editing, data);
      } else {
        await createEvent(data);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyEvent);
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setForm({
      name: event.name,
      description: event.description || '',
      date: event.date || '',
      venueId: event.venueId || '',
      maxAttendees: event.maxAttendees || '',
      status: event.status || 'UPCOMING',
    });
    setEditing(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div>
      <div className="section-header">
        <h3>{events.length} Events</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyEvent); }}>
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Event Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Venue ID</label>
              <input type="number" value={form.venueId} onChange={(e) => setForm({ ...form, venueId: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Attendees</label>
              <input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Event</button>
        </form>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.id}</td>
                <td>{ev.name}</td>
                <td>{ev.date}</td>
                <td><span className={`badge badge-${ev.status?.toLowerCase()}`}>{ev.status}</span></td>
                <td>{ev.venueId || '-'}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(ev)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
