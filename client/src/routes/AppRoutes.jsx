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
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
