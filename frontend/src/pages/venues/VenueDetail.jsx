import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenue, getVenueAvailability } from '../../services/api';

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenue();
  }, [id]);

  const loadVenue = async () => {
    try {
      const [venueRes, availRes] = await Promise.all([
        getVenue(id),
        getVenueAvailability(id).catch(() => ({ data: null })),
      ]);
      setVenue(venueRes.data);
      setAvailability(availRes.data);
    } catch (err) {
      console.error('Failed to load venue', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading venue...</div>;
  if (!venue) return <div className="empty-state"><h3>Venue not found</h3></div>;

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>Back</button>
      <div className="detail-card">
        <div className="detail-header">
          {venue.imageUrl ? (
            <img src={venue.imageUrl} alt={venue.name} className="detail-img" />
          ) : (
            <div className="detail-placeholder">No Image</div>
          )}
          <div>
            <h1>{venue.name}</h1>
            <p className="detail-location">{venue.location}</p>
            <span className={`badge ${venue.available !== false ? 'badge-upcoming' : 'badge-cancelled'}`}>
              {venue.available !== false ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-info-grid">
            <div className="detail-info">
              <label>Capacity</label>
              <span>{venue.capacity} people</span>
            </div>
            <div className="detail-info">
              <label>Price</label>
              <span>${venue.pricePerHour}/hour</span>
            </div>
          </div>

          {venue.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{venue.description}</p>
            </div>
          )}

          {availability && (
            <div className="detail-section">
              <h3>Availability</h3>
              <p>{typeof availability === 'string' ? availability : JSON.stringify(availability)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
