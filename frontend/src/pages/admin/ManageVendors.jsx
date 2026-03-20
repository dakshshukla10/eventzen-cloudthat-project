import { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../services/api';

const emptyVendor = { name: '', serviceType: '', contactEmail: '', phone: '' };

export default function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVendor);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to load vendors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateVendor(editing, form);
      } else {
        await createVendor(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyVendor);
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save vendor');
    }
  };

  const handleEdit = (vendor) => {
    setForm({
      name: vendor.name,
      serviceType: vendor.serviceType || '',
      contactEmail: vendor.contactEmail || '',
      phone: vendor.phone || '',
    });
    setEditing(vendor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    try {
      await deleteVendor(id);
      loadVendors();
    } catch (err) {
      alert('Failed to delete vendor');
    }
  };

  if (loading) return <div className="loading">Loading vendors...</div>;

  return (
    <div>
      <div className="section-header">
        <h3>{vendors.length} Vendors</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyVendor); }}>
          {showForm ? 'Cancel' : '+ Add Vendor'}
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
              <label>Service Type</label>
              <input value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} required placeholder="e.g. Catering, Photography" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Vendor</button>
        </form>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Service Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.serviceType}</td>
                <td>{v.contactEmail}</td>
                <td>{v.phone || '-'}</td>
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
