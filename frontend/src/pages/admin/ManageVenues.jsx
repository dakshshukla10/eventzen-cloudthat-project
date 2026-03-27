import { useState, useEffect } from 'react';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../../services/api';

const emptyVenue = {
  name: '',
  location: '',
  capacity: '',
  description: '',
  pricePerHour: '',
  imageUrl: '',
  contactEmail: '',
  phone: '',
};

export default function ManageVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVenue);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const res = await getVenues();
      setVenues(res.data);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, capacity: parseInt(form.capacity), pricePerHour: parseFloat(form.pricePerHour) };
    try {
      if (editing) {
        await updateVenue(editing, data);
      } else {
        await createVenue(data);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyVenue);
      loadVenues();
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      alert(Array.isArray(validationErrors) ? validationErrors.join('\n') : 'Failed to save venue');
    }
  };

  const handleEdit = (venue) => {
    setForm({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      description: venue.description || '',
      pricePerHour: venue.pricePerHour,
      imageUrl: venue.imageUrl || '',
      contactEmail: venue.contactEmail || '',
      phone: venue.phone || '',
    });
    setEditing(venue.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this venue?')) return;
    try {
      await deleteVenue(id);
      loadVenues();
    } catch (err) {
      alert('Failed to delete venue');
    }
  };

  if (loading) return <div className="loading">Loading venues...</div>;

  return (
    <div>
      <div className="section-header">
        <h3>{venues.length} Venues</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyVenue); }}>
          {showForm ? 'Cancel' : '+ Add Venue'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Price Per Hour ($)</label>
              <input type="number" step="0.01" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Venue</button>
        </form>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Price/hr</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.location}</td>
                <td>{v.capacity}</td>
                <td>${v.pricePerHour}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(v)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>Delete</button>
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
