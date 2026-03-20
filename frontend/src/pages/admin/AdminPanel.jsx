import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ManageBookings from './ManageBookings';
import ManageVenues from './ManageVenues';
import ManageEvents from './ManageEvents';
import ManageVendors from './ManageVendors';

export default function AdminPanel() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { path: '/admin', label: 'Bookings' },
    { path: '/admin/venues', label: 'Venues' },
    { path: '/admin/events', label: 'Events' },
    { path: '/admin/vendors', label: 'Vendors' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage your platform</p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab ${currentPath === tab.path ? 'tab-active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Routes>
        <Route index element={<ManageBookings />} />
        <Route path="venues" element={<ManageVenues />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="vendors" element={<ManageVendors />} />
      </Routes>
    </div>
  );
}
