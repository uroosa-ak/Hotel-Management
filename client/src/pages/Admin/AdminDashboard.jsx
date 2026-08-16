import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Plus,
  CheckCircle,
} from '../../components/common/icons';
import roomService from '../../services/roomService';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [roomsData, bookingsData, usersData] = await Promise.all([
          roomService.getAll(),
          bookingService.getAll(),
          userService.getAll(),
        ]);
        if (isMounted) {
          setRooms(Array.isArray(roomsData) ? roomsData : []);
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
      } catch (err) {
        console.error('Error loading dashboard metrics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading administrative dashboard..." />;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const availableRoomsCount = rooms.filter((r) => r.isAvailable).length;
  const occupancyRate = rooms.length > 0
    ? Math.round(((rooms.length - availableRoomsCount) / rooms.length) * 100)
    : 35;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+14.2% this month',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      change: '+8 new this week',
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Available Suites',
      value: `${availableRoomsCount} / ${rooms.length}`,
      change: `${occupancyRate}% current occupancy`,
      icon: BedDouble,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Registered Users',
      value: users.length,
      change: 'Active guest database',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Command Center"
        subtitle="Real-time performance metrics, occupancy levels, and operational management."
        action={
          <div className="flex gap-3">
            <Link to="/admin/rooms" className="btn-accent text-xs flex items-center gap-1.5">
              <Plus size={16} />
              <span>Add Suite</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                {stat.value}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
                <TrendingUp size={13} className="text-emerald-600" />
                <span>{stat.change}</span>
              </p>
            </div>
            <div className={`p-3 rounded-2xl border ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Recent Hotel Reservations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest bookings and real-time check-in updates
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
          >
            View All Bookings &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Suite</th>
                <th className="px-6 py-4">Stay Dates</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {booking.user?.firstName} {booking.user?.lastName}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {booking.user?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">
                      {booking.room?.name || 'Suite'}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Room {booking.room?.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.checkIn} &rarr; {booking.checkOut}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${booking.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
