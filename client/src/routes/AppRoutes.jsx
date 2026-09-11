import React from 'react';
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
import Services from '../pages/Services/Services';
import Contact from '../pages/Contact/Contact';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminRooms from '../pages/Admin/AdminRooms';
import AdminBookings from '../pages/Admin/AdminBookings';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminCheckInOut from '../pages/Admin/AdminCheckInOut';
import AdminHousekeeping from '../pages/Admin/AdminHousekeeping';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Customer Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:id" element={<RoomDetail />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="booking" element={<Booking />} />
          <Route path="booking/:id" element={<Booking />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Protected Admin Portal Layout */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="check-in-out" element={<AdminCheckInOut />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="housekeeping" element={<AdminHousekeeping />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
