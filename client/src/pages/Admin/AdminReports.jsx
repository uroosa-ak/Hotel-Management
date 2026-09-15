import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3 } from '../../components/common/icons';
import reportService from '../../services/reportService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4">
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const BreakdownList = ({ title, data }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{title}</p>
    <div className="space-y-2">
      {Object.entries(data || {}).length === 0 ? (
        <p className="text-xs text-slate-400">No data available.</p>
      ) : (
        Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="capitalize text-slate-600">{key.replace(/_/g, ' ')}</span>
            <span className="font-semibold text-slate-900">{val}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const TABS = [
  { id: 'overview', label: 'Overview & Trends' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'guests', label: 'Guests' },
  { id: 'staff', label: 'Staff' },
  { id: 'housekeeping', label: 'Housekeeping' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'services', label: 'Services' },
  { id: 'feedback', label: 'Feedback' },
];

const AdminReports = () => {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [occupancy, revenue, trends, popular, reservations, guests, staff, housekeeping, maintenance, services, feedback] =
        await Promise.all([
          reportService.occupancy(),
          reportService.revenue(),
          reportService.trends(),
          reportService.popular(),
          reportService.reservations(),
          reportService.guests(),
          reportService.staff(),
          reportService.housekeeping(),
          reportService.maintenance(),
          reportService.services(),
          reportService.feedback(),
        ]);
      setData({ occupancy, revenue, trends, popular, reservations, guests, staff, housekeeping, maintenance, services, feedback });
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const trendChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Bookings', 'Revenue'], textStyle: { fontSize: 10 } },
    grid: { left: 40, right: 20, top: 40, bottom: 20 },
    xAxis: { type: 'category', data: (data.trends || []).map((t) => t.label) },
    yAxis: [{ type: 'value' }, { type: 'value' }],
    series: [
      { name: 'Bookings', type: 'bar', data: (data.trends || []).map((t) => t.bookings) },
      { name: 'Revenue', type: 'line', yAxisIndex: 0, data: (data.trends || []).map((t) => t.revenue) },
    ],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Occupancy, revenue, reservation, guest, staff, and service performance across the hotel."
      />

      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Generating reports..." />
      ) : tab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Occupancy Rate" value={`${data.occupancy?.occupancyRate ?? 0}%`} />
            <StatCard label="Total Revenue" value={`PKR ${(data.revenue?.totalRevenue ?? 0).toLocaleString()}`} />
            <StatCard label="Total Bookings" value={data.revenue?.bookingCount ?? 0} />
            <StatCard label="Avg. Rating" value={data.feedback?.avgRating ?? 0} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <BarChart3 size={14} /> 6-Month Booking & Revenue Trend
            </p>
            <ReactECharts option={trendChartOption} style={{ height: 300 }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BreakdownList title="Popular Room Types" data={
              (data.popular?.popularRooms || []).reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {})
            } />
            <BreakdownList title="Room Status Breakdown" data={data.occupancy?.byStatus} />
          </div>
        </div>
      ) : tab === 'reservations' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Total Reservations" value={data.reservations?.total ?? 0} />
          <BreakdownList title="By Status" data={data.reservations?.byStatus} />
        </div>
      ) : tab === 'guests' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Guests" value={data.guests?.total ?? 0} />
          <StatCard label="Repeat Guests" value={data.guests?.repeatGuests ?? 0} />
          <StatCard label="New Guests" value={data.guests?.newGuests ?? 0} />
        </div>
      ) : tab === 'staff' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Staff" value={data.staff?.total ?? 0} />
            <StatCard label="Active Staff" value={data.staff?.active ?? 0} />
          </div>
          <BreakdownList title="By Role" data={data.staff?.byRole} />
        </div>
      ) : tab === 'housekeeping' ? (
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Rooms" value={data.housekeeping?.totalRooms ?? 0} />
          <StatCard label="Awaiting Clean" value={data.housekeeping?.cleaning ?? 0} />
          <StatCard label="Ready" value={data.housekeeping?.ready ?? 0} />
        </div>
      ) : tab === 'maintenance' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BreakdownList title="By Status" data={data.maintenance?.byStatus} />
          <BreakdownList title="By Priority" data={data.maintenance?.byPriority} />
        </div>
      ) : tab === 'services' ? (
        <BreakdownList title="Services by Category" data={data.services?.byCategory} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Reviews" value={data.feedback?.total ?? 0} />
            <StatCard label="Average Rating" value={data.feedback?.avgRating ?? 0} />
          </div>
          <BreakdownList title="Rating Distribution" data={data.feedback?.distribution} />
        </div>
      )}
    </div>
  );
};

export default AdminReports;
