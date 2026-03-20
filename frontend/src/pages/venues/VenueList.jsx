import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVenues } from '../../services/api';

export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({ location: '', capacity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getVenues(params);
      setVenues(res.data);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.location) params.location = filters.location;
    if (filters.capacity) params.capacity = filters.capacity;
    loadVenues(params);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Venues</h1>
        <p>Discover the perfect venue for your event</p>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min capacity..."
          value={filters.capacity}
          onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading venues...</div>
      ) : venues.length === 0 ? (
        <div className="empty-state">
          <h3>No venues found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="card-grid">
          {venues.map((venue) => (
            <Link to={`/venues/${venue.id}`} key={venue.id} className="venue-card">
              <div className="venue-card-img">
                {venue.imageUrl ? (
                  <img src={venue.imageUrl} alt={venue.name} />
                ) : (
                  <div className="venue-placeholder">No Image</div>
                )}
              </div>
              <div className="venue-card-body">
                <h3>{venue.name}</h3>
                <p className="venue-location">{venue.location}</p>
                <div className="venue-meta">
                  <span>Capacity: {venue.capacity}</span>
                  <span className="venue-price">${venue.pricePerHour}/hr</span>
                </div>
                <span className={`badge ${venue.available !== false ? 'badge-upcoming' : 'badge-cancelled'}`}>
                  {venue.available !== false ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
