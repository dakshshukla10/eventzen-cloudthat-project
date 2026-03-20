import { useState, useEffect } from 'react';
import { getAdminBookings, approveBooking, rejectBooking } from '../../services/api';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getAdminBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div>
      {bookings.length === 0 ? (
        <div className="empty-state"><h3>No bookings to manage</h3></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Event ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.userName}</td>
                  <td>{b.userEmail}</td>
                  <td>{b.eventId}</td>
                  <td>{b.bookingDate}</td>
                  <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'PENDING' && (
                      <div className="btn-group">
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(b.id)}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.id)}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
