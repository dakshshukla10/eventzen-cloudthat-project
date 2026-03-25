import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getVenues, getVendors } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emptyEvent = { name: '', description: '', date: '', venueId: '', vendorId: '', maxAttendees: '', status: 'UPCOMING' };

export default function ManageEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsRes, venuesRes, vendorsRes] = await Promise.all([
        getEvents(),
        getVenues(),
        getVendors(),
      ]);
      setEvents(eventsRes.data);
      setVenues(venuesRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      date: form.date ? form.date + 'T00:00:00' : null,
      venueId: form.venueId ? parseInt(form.venueId) : null,
      vendorId: form.vendorId ? parseInt(form.vendorId) : null,
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
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setForm({
      name: event.name,
      description: event.description || '',
      date: event.date ? event.date.substring(0, 10) : '',
      venueId: event.venueId || '',
      vendorId: event.vendorId || '',
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
      loadData();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const getVenueName = (venueId) => {
    const venue = venues.find((v) => v.id === venueId);
    return venue ? venue.name : '-';
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : '-';
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
              <label>Venue</label>
              <select value={form.venueId} onChange={(e) => setForm({ ...form, venueId: e.target.value })} required>
                <option value="">Select a venue</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} - {v.location} (Capacity: {v.capacity})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Vendor</label>
              <select value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
                <option value="">Select a vendor (optional)</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} - {v.serviceType}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Max Attendees</label>
              <input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })} />
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
              <th>Vendor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.id}</td>
                <td>{ev.name}</td>
                <td>{ev.date ? ev.date.substring(0, 10) : '-'}</td>
                <td><span className={`badge badge-${ev.status?.toLowerCase()}`}>{ev.status}</span></td>
                <td>{getVenueName(ev.venueId)}</td>
                <td>{getVendorName(ev.vendorId)}</td>
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
