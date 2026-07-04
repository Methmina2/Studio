import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Rentals from './pages/Rentals';
import RentalApplication from './pages/RentalApplication';
import Production from './pages/Production';
import StudioLabs from './pages/StudioLabs';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/admin/PrivateRoute';
import Wedding from './pages/Wedding';

// Lazy load admin pages for better performance
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminRentals = lazy(() => import('./pages/admin/AdminRentals'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminCalendar = lazy(() => import('./pages/admin/AdminCalender'));
const AdminCrew = lazy(() => import('./pages/admin/AdminCrew'));

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/booking" element={<Layout><Booking /></Layout>} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/rental-application" element={<RentalApplication />} />
      <Route path="/production" element={<Production />} />
      <Route path="/studiolabs" element={<StudioLabs />} />
      <Route path="/wedding" element={<Wedding />} />

      {/* Admin routes – lazy loaded */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminDashboard />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminBookings />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/rentals"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminRentals />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/contacts"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminContacts />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminServices />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminCalendar />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/crew"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
              <AdminCrew />
            </Suspense>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;