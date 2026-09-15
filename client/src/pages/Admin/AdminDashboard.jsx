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

  // Role permissions
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

  if (loading) return <LoadingSpinner fullScreen text="Loading luxury management dashboard..." />;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const availableRoomsCount = rooms.filter((r) => r.isAvailable || r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const cleaningCount = rooms.filter((r) => r.status === 'cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'maintenance').length;

  const occupancyRate = rooms.length > 0
    ? Math.round(((rooms.length - availableRoomsCount) / rooms.length) * 100)
    : 0;

  // ADR (Average Daily Rate) & RevPAR (Revenue Per Available Room) - Blueprint Section 7.4
  const adr = occupiedCount > 0 
    ? Math.round(totalRevenue / Math.max(1, bookings.length)) 
    : (bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 220);
  const revPar = Math.round((adr * occupancyRate) / 100);

  const stats = [
    {
      title: 'Gross Invoiced Revenue',
      value: `PKR ${totalRevenue.toLocaleString()}`,
      change: `${bookings.length} reservations to date`,
      icon: DollarSign,
      color: 'text-[#c19c77] bg-[#c19c77]/10 border-[#c19c77]/30',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: `${availableRoomsCount} of ${rooms.length} suites vacant`,
      icon: BedDouble,
      color: 'text-[#4c7a5a] bg-[#4c7a5a]/10 border-[#4c7a5a]/25',
    },
    {
      title: 'ADR / RevPAR',
      value: `PKR ${adr.toLocaleString()} / PKR ${revPar.toLocaleString()}`,
      change: `ADR: PKR ${adr.toLocaleString()} • RevPAR: PKR ${revPar.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-[#2b6cb0] bg-[#2b6cb0]/10 border-[#2b6cb0]/25',
    },
    {
      title: 'Maintenance & Care',
      value: `${maintenanceCount} / ${cleaningCount}`,
      change: `${maintenanceCount} Maint. • ${cleaningCount} Cleaning`,
      icon: Users,
      color: 'text-[#c53030] bg-[#c53030]/10 border-[#c53030]/25',
    },
  ];

  // Revenue trajectory (last 6 months)
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

  // ECharts: Luxury Gold Revenue Trend
  const revenueChartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c}',
      backgroundColor: '#1c1c1c',
      borderColor: '#c19c77',
      textStyle: { color: '#ffffff', fontFamily: 'Jost' },
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
      axisLine: { lineStyle: { color: '#d1c8be' } },
      axisLabel: { color: '#736d65', fontFamily: 'Jost' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#d1c8be' } },
      axisLabel: { color: '#736d65', fontFamily: 'Jost' },
      splitLine: { lineStyle: { color: '#f2eeea' } },
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: revenueByMonth,
        itemStyle: { color: '#c19c77' },
        lineStyle: { width: 3, color: '#c19c77' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(193, 156, 119, 0.45)' },
              { offset: 1, color: 'rgba(193, 156, 119, 0.02)' },
            ],
          },
        },
      },
    ],
  };

  // ECharts: Luxury Room Status Donut
  const roomStatusChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: '#1c1c1c',
      borderColor: '#c19c77',
      textStyle: { color: '#ffffff', fontFamily: 'Jost' },
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      textStyle: { color: '#736d65', fontSize: 11, fontFamily: 'Jost' },
    },
    series: [
      {
        name: 'Room Status',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: { show: false },
        data: [
          { value: availableRoomsCount, name: 'Available', itemStyle: { color: '#4c7a5a' } },
          { value: occupiedCount, name: 'Occupied', itemStyle: { color: '#c19c77' } },
          { value: cleaningCount, name: 'Cleaning', itemStyle: { color: '#d97706' } },
          { value: maintenanceCount, name: 'Maintenance', itemStyle: { color: '#b4453c' } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Overview"
        subtitle="Real-time performance metrics, occupancy levels, and operational management."
        action={
          ['admin', 'manager'].includes(user?.role) && (
            <div className="flex gap-3">
              <Link
                to="/admin/rooms"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c19c77] hover:bg-[#a9865f] text-white text-xs uppercase tracking-wider font-semibold rounded-sm shadow-md transition-colors"
              >
                <Plus size={15} />
                <span>Add Suite</span>
              </Link>
            </div>
          )
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#eae5de] flex items-start justify-between hover:-translate-y-0.5 transition-transform"
          >
            <div>
              <p className="text-[11px] font-semibold text-[#8c8275] uppercase tracking-widest mb-1.5">
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold text-[#1c1c1c] font-serif">
                {stat.value}
              </h3>
              <p className="text-xs text-[#736d65] mt-2.5 flex items-center gap-1.5 font-medium">
                <TrendingUp size={13} className="text-[#4c7a5a]" />
                <span>{stat.change}</span>
              </p>
            </div>
            <div className={`p-3 rounded-sm border ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Apache ECharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#eae5de]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f2eeea]">
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] font-serif">
                Revenue & Demand Trajectory
              </h3>
              <p className="text-xs text-[#736d65] mt-0.5">
                Monthly revenue performance powered by Apache ECharts
              </p>
            </div>
            <span className="px-3 py-1 bg-[#f4ece4] text-[#c19c77] text-[10px] font-bold rounded-sm uppercase tracking-widest border border-[#e7dbcd]">
              Live Feed
            </span>
          </div>
          <div className="h-72">
            <ReactECharts option={revenueChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Room Status Donut Chart */}
        <div className="bg-white p-6 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#eae5de]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f2eeea]">
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] font-serif">
                Suite Inventory
              </h3>
              <p className="text-xs text-[#736d65] mt-0.5">
                Live occupancy distribution
              </p>
            </div>
            <ShieldCheck size={18} className="text-[#c19c77]" />
          </div>
          <div className="h-72">
            <ReactECharts option={roomStatusChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      {canSeeBookings && (
        <div className="bg-white rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#eae5de] overflow-hidden">
          <div className="p-6 border-b border-[#f2eeea] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1c1c1c] font-serif">
                Recent Guest Reservations
              </h3>
              <p className="text-xs text-[#736d65] mt-0.5">
                Latest hotel reservations and real-time check-in updates
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-[#c19c77] hover:text-[#a9865f] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>View All Reservations</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5c5c5c]">
              <thead className="bg-[#faf8f5] text-[#1c1c1c] uppercase font-semibold text-[10px] tracking-wider border-b border-[#eae5de]">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Suite</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2eeea]">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#8c8275]">
                      No reservations recorded yet.
                    </td>
                  </tr>
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id} className="hover:bg-[#fcfbfa] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#1c1c1c]">
                        {booking.user?.firstName || 'Guest'} {booking.user?.lastName || ''}
                        <span className="block text-[11px] text-[#8c8275] font-normal">
                          {booking.user?.email || 'guest@luxurystay.com'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#1c1c1c]">
                          {booking.room?.name || 'Suite'}
                        </span>
                        <span className="block text-[11px] text-[#8c8275]">
                          Room {booking.room?.roomNumber || '101'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.checkIn || '2026-09-12'} &rarr; {booking.checkOut || '2026-09-15'}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1c1c1c]">
                        ${booking.totalAmount || 540}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status || 'confirmed'} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.paymentStatus || 'paid'} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
