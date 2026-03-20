import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">EventZen</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/venues">Venues</Link>
            <Link to="/events">Events</Link>
            {!isAdmin() && <Link to="/bookings">My Bookings</Link>}
            {isAdmin() && <Link to="/admin">Admin Panel</Link>}
            <span className="nav-user">{user.name}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
