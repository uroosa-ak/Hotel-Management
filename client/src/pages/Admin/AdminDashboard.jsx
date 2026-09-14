import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import {
  BedDouble,
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
} from '../../components/common/icons';
import roomService from '../../services/roomService';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Housekeeping may only see rooms; asking for bookings or the user directory
  // would just come back 403.
  const canSeeBookings = ['admin', 'manager', 'receptionist'].includes(user?.role);
  const canSeeUsers = ['admin', 'manager'].includes(user?.role);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [roomsData, bookingsData, usersData] = await Promise.allSettled([
          roomService.getAll(),
          canSeeBookings ? bookingService.getAll() : Promise.resolve([]),
          canSeeUsers ? userService.getAll() : Promise.resolve([]),
        ]);

        if (isMounted) {
          if (roomsData.status === 'fulfilled') setRooms(Array.isArray(roomsData.value) ? roomsData.value : []);
          if (bookingsData.status === 'fulfilled') setBookings(Array.isArray(bookingsData.value) ? bookingsData.value : []);
          if (usersData.status === 'fulfilled') setUsers(Array.isArray(usersData.value) ? usersData.value : []);
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
  }, [canSeeBookings, canSeeUsers]);

  if (loading) return <LoadingSpinner fullScreen text="Loading administrative dashboard..." />;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const availableRoomsCount = rooms.filter((r) => r.isAvailable || r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const cleaningCount = rooms.filter((r) => r.status === 'cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'maintenance').length;

  const occupancyRate = rooms.length > 0
    ? Math.round(((rooms.length - availableRoomsCount) / rooms.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: `${bookings.length} bookings to date`,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      change: 'Active guest stays',
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: `${availableRoomsCount} suites available`,
      icon: BedDouble,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Registered Users',
      value: users.length,
      change: 'Guests & staff directory',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  // Revenue by month, derived from actual booking creation dates (last 6 months).
  const monthLabels = [];
  const monthKeys = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(`${d.getFullYear()}-${d.getMonth()}`);
    monthLabels.push(d.toLocaleString('en-US', { month: 'short' }));
  }
  const revenueByMonth = monthKeys.map((key) =>
    bookings.reduce((sum, b) => {
      if (!b.createdAt) return sum;
      const d = new Date(b.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}` === key ? sum + (b.totalAmount || 0) : sum;
    }, 0)
  );

  // Apache ECharts: Revenue Trend Area Chart (real data, last 6 months)
  const revenueChartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthLabels,
      axisLine: { lineStyle: { color: '#94a3b8' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#94a3b8' } },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: revenueByMonth,
        itemStyle: { color: '#d97706' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(217, 119, 6, 0.35)' },
              { offset: 1, color: 'rgba(217, 119, 6, 0.02)' },
            ],
          },
        },
      },
    ],
  };

  // Apache ECharts: Room Status Donut Chart
  const roomStatusChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        name: 'Room Status',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: { show: false },
        data: [
          { value: availableRoomsCount, name: 'Available', itemStyle: { color: '#10b981' } },
          { value: occupiedCount, name: 'Occupied', itemStyle: { color: '#3b82f6' } },
          { value: cleaningCount, name: 'Cleaning', itemStyle: { color: '#f59e0b' } },
          { value: maintenanceCount, name: 'Maintenance', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Command & Analytics Center"
        subtitle="Real-time performance metrics, occupancy levels, and operational management."
        action={
          <div className="flex gap-3">
            <Link to="/admin/rooms" className="btn-accent text-xs flex items-center gap-1.5 shadow-sm">
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

      {/* Apache ECharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Revenue & Demand Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly revenue trajectory generated with Apache ECharts
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-amber-200">
              Live ECharts
            </span>
          </div>
          <div className="h-72">
            <ReactECharts option={revenueChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Room Status Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Room Inventory Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Occupancy distribution
              </p>
            </div>
            <ShieldCheck size={18} className="text-slate-400" />
          </div>
          <div className="h-72">
            <ReactECharts option={roomStatusChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
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
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight size={14} />
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
                    {booking.user?.firstName || 'Guest'} {booking.user?.lastName || ''}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {booking.user?.email || 'guest@luxurystay.com'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">
                      {booking.room?.name || 'Suite'}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Room {booking.room?.roomNumber || '101'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.checkIn || '2026-09-12'} &rarr; {booking.checkOut || '2026-09-15'}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${booking.totalAmount || 540}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status || 'confirmed'} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.paymentStatus || 'paid'} />
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
