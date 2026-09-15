import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public & User Pages
import Home from '../pages/Home/Home';
import Rooms from '../pages/Rooms/Rooms';
import RoomDetail from '../pages/Rooms/RoomDetail';
import Booking from '../pages/Booking/Booking';
import MyBookings from '../pages/MyBookings/MyBookings';
import Profile from '../pages/Profile/Profile';
import About from '../pages/About/About';
import Prices from '../pages/Prices/Prices';
import Services from '../pages/Services/Services';
import Contact from '../pages/Contact/Contact';
import ComingSoon from '../pages/ComingSoon/ComingSoon';
import Shop from '../pages/Shop/Shop';
import ProductDetail from '../pages/Shop/ProductDetail';
import Blog from '../pages/Blog/Blog';
import BlogDetail from '../pages/Blog/BlogDetail';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Admin Pages - lazy-loaded so guest-facing visitors never download the admin bundle
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminRooms = lazy(() => import('../pages/Admin/AdminRooms'));
const AdminBookings = lazy(() => import('../pages/Admin/AdminBookings'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers'));
const AdminCheckInOut = lazy(() => import('../pages/Admin/AdminCheckInOut'));
const AdminHousekeeping = lazy(() => import('../pages/Admin/AdminHousekeeping'));
const AdminGuests = lazy(() => import('../pages/Admin/AdminGuests'));
const AdminPayments = lazy(() => import('../pages/Admin/AdminPayments'));
const AdminFeedback = lazy(() => import('../pages/Admin/AdminFeedback'));
const AdminPromotions = lazy(() => import('../pages/Admin/AdminPromotions'));
const AdminTaxes = lazy(() => import('../pages/Admin/AdminTaxes'));
const AdminInventory = lazy(() => import('../pages/Admin/AdminInventory'));
const AdminReports = lazy(() => import('../pages/Admin/AdminReports'));
const AdminSettings = lazy(() => import('../pages/Admin/AdminSettings'));
const AdminSecurity = lazy(() => import('../pages/Admin/AdminSecurity'));
const AdminAuditLogs = lazy(() => import('../pages/Admin/AdminAuditLogs'));
const AdminRolesView = lazy(() => import('../pages/Admin/AdminRolesView'));
const GuestServices = lazy(() => import('../pages/Guest/GuestServices'));
const GuestNotifications = lazy(() => import('../pages/Guest/GuestNotifications'));
const GuestFeedbackHistory = lazy(() => import('../pages/Guest/GuestFeedbackHistory'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Customer Layout with Motela Theme */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:id" element={<RoomDetail />} />
        <Route path="about" element={<About />} />
        <Route path="prices" element={<Prices />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:slug" element={<ProductDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Customer Reservation & Profile Routes */}
        <Route path="booking" element={<Booking />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route element={<ProtectedRoute />}>
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="my-services"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <GuestServices />
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <GuestNotifications />
              </Suspense>
            }
          />
          <Route
            path="feedback-history"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <GuestFeedbackHistory />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Protected Admin Portal Layout */}
      <Route
        path="/admin"
        element={<AdminRoute />}
      >
        <Route element={<AdminLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="check-in-out"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminCheckInOut />
              </Suspense>
            }
          />
          <Route
            path="rooms"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminRooms />
              </Suspense>
            }
          />
          <Route
            path="bookings"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminBookings />
              </Suspense>
            }
          />
          <Route
            path="housekeeping"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminHousekeeping />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminUsers />
              </Suspense>
            }
          />
          <Route
            path="guests"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminGuests />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminPayments />
              </Suspense>
            }
          />
          <Route
            path="feedback"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminFeedback />
              </Suspense>
            }
          />
          <Route
            path="promotions"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminPromotions />
              </Suspense>
            }
          />
          <Route
            path="taxes"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminTaxes />
              </Suspense>
            }
          />
          <Route
            path="inventory"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminInventory />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminReports />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminSettings />
              </Suspense>
            }
          />
          <Route
            path="security"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminSecurity />
              </Suspense>
            }
          />
          <Route
            path="audit-logs"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminAuditLogs />
              </Suspense>
            }
          />
          <Route
            path="roles"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                <AdminRolesView />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
