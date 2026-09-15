import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Search,
  Printer,
  BedDouble,
  Users,
  LogOut,
  Shield,
  Plus,
  Sparkles,
  Wrench,
  X,
} from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import roomService from '../../services/roomService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InvoiceModal from '../../components/booking/InvoiceModal';

const AdminCheckInOut = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'arrivals' | 'in_house' | 'all'
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  
  // Quick Action Drawer / Modal State
  const [drawerRoom, setDrawerRoom] = useState(null);

  // Walk-in Wizard Modal State
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    roomNumber: '',
    guestName: '',
    email: '',
    phone: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    paymentMethod: 'cash',
  });
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  const fetchData = async () => {
    try {
      const [bookingsData, roomsData] = await Promise.allSettled([
        bookingService.getAll(),
        roomService.getAll(),
      ]);

      if (bookingsData.status === 'fulfilled') {
        setBookings(Array.isArray(bookingsData.value) ? bookingsData.value : []);
      }
      if (roomsData.status === 'fulfilled') {
        setRooms(Array.isArray(roomsData.value) ? roomsData.value : []);
      }
    } catch (err) {
      console.error('Failed to load front desk data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessCheckIn = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'checked-in');
      await fetchData();
      if (drawerRoom) setDrawerRoom(null);
    } catch (err) {
      console.error('Check-in failed', err);
    }
  };

  const handleProcessCheckOut = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'checked-out');
      await fetchData();
      if (drawerRoom) setDrawerRoom(null);
    } catch (err) {
      console.error('Check-out failed', err);
    }
  };

  const handleUpdateRoomStatusDirect = async (roomId, newStatus) => {
    try {
      await roomService.update(roomId, { status: newStatus });
      await fetchData();
      if (drawerRoom) {
        setDrawerRoom((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Failed to update room state', err);
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    setSubmittingWalkIn(true);
    try {
      const targetRoom = rooms.find((r) => String(r.roomNumber) === String(walkInForm.roomNumber));
      if (!targetRoom) {
        alert('Please select a valid vacant room.');
        return;
      }

      await bookingService.create({
        room: targetRoom._id,
        checkIn: walkInForm.checkIn,
        checkOut: walkInForm.checkOut,
        guests: 1,
        specialRequests: `Walk-in Guest: ${walkInForm.guestName} (${walkInForm.phone})`,
      });

      setShowWalkInModal(false);
      setWalkInForm({
        roomNumber: '',
        guestName: '',
        email: '',
        phone: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        paymentMethod: 'cash',
      });
      await fetchData();
    } catch (err) {
      alert(err.message || 'Walk-in creation failed.');
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  // Filter bookings for roster view
  const filteredBookings = bookings.filter((b) => {
    const guestName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
    const roomNum = String(b.room?.roomNumber || '').toLowerCase();
    const matchesSearch = guestName.includes(searchTerm.toLowerCase()) || roomNum.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'arrivals') {
      return b.status === 'confirmed' || b.status === 'pending';
    }
    if (activeTab === 'in_house') {
      return b.status === 'checked-in' || b.status === 'checked_in';
    }
    return true;
  });

  // Extract unique floors
  const floors = Array.from(new Set(rooms.map((r) => r.floor || 1))).sort((a, b) => a - b);

  // Filter rooms for floor grid
  const filteredRooms = rooms.filter((r) => {
    const matchFloor = selectedFloor === 'all' || String(r.floor) === String(selectedFloor);
    const matchSearch = String(r.roomNumber).includes(searchTerm) || (r.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchFloor && matchSearch;
  });

  // Color mapper strictly matching Section 7.2 of Blueprint:
  // Green (Available), Red (Occupied), Yellow (Cleaning), Blue (Reserved), Purple (Dirty/Needs Cleaning), Grey (Out of Order)
  const getRoomStatusColor = (room) => {
    const st = (room.status || room.currentStatus || 'available').toLowerCase();
    if (st === 'occupied') {
      return {
        bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-300 text-rose-800',
        badge: 'bg-rose-600 text-white',
        label: 'Occupied',
      };
    }
    if (st === 'cleaning') {
      return {
        bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-800',
        badge: 'bg-amber-500 text-white',
        label: 'Cleaning',
      };
    }
    if (st === 'reserved') {
      return {
        bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-300 text-blue-800',
        badge: 'bg-blue-600 text-white',
        label: 'Reserved',
      };
    }
    if (st === 'maintenance' || st === 'out_of_order') {
      return {
        bg: 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-700',
        badge: 'bg-slate-600 text-white',
        label: 'Out of Order',
      };
    }
    return {
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800',
      badge: 'bg-emerald-600 text-white',
      label: 'Available',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Front Desk Command Center"
          subtitle="Real-time interactive floor grid, instant check-in/out dispatch, and guest folio management."
        />
        <button
          onClick={() => setShowWalkInModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>60-Sec Walk-in Wizard</span>
        </button>
      </div>

      {/* Control / View Switcher Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Interactive Floor Grid
          </button>
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'arrivals'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Arrivals ({bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('in_house')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'in_house'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In-House Stays ({bookings.filter((b) => b.status === 'checked-in' || b.status === 'checked_in').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Stays
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'grid' ? 'Filter room #' : 'Search guest, suite...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE FLOOR GRID MATRIX */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          {/* Floor Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Floors:
            </span>
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFloor === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Floors
            </button>
            {floors.map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  String(selectedFloor) === String(fl)
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Floor {fl}
              </button>
            ))}
          </div>

          {/* Color legend */}
          <div className="flex flex-wrap items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Cleaning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Reserved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-500 inline-block"></span> Out of Order
            </span>
          </div>

          {/* Grid Blocks */}
          {loading ? (
            <LoadingSpinner size="lg" text="Loading floor matrix..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredRooms.map((room) => {
                const style = getRoomStatusColor(room);
                const activeStay = bookings.find(
                  (b) =>
                    (b.room?._id === room._id || String(b.room?.roomNumber) === String(room.roomNumber)) &&
                    (b.status === 'checked-in' || b.status === 'checked_in')
                );

                return (
                  <div
                    key={room._id}
                    onClick={() => setDrawerRoom({ ...room, activeStay })}
                    className={`p-3.5 rounded-2xl border-2 transition-all shadow-xs cursor-pointer flex flex-col justify-between h-28 hover:scale-[1.02] ${style.bg}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-lg font-bold font-mono tracking-tight text-slate-900">
                        {room.roomNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold truncate text-slate-800">
                        {room.name || room.roomType}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {activeStay ? `${activeStay.user?.firstName || 'Guest'}` : `Floor ${room.floor} • $${room.price}/n`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DAILY ROSTER TABLE */}
      {activeTab !== 'grid' && (
        <>
          {loading ? (
            <LoadingSpinner size="lg" text="Loading guest registry..." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Guest Info</th>
                      <th className="px-6 py-4">Assigned Suite</th>
                      <th className="px-6 py-4">Stay Dates</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Billing</th>
                      <th className="px-6 py-4 text-right">Desk Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No matching reservations found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {b.user?.firstName || 'Guest'} {b.user?.lastName || ''}
                            <span className="block text-[11px] text-slate-400 font-normal font-mono">
                              {b.user?.email || 'guest@luxurystay.com'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-800">
                              {b.room?.name || 'Deluxe Suite'}
                            </span>
                            <span className="block text-[11px] text-amber-600 font-medium">
                              Room {b.room?.roomNumber || '101'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <CalendarDays size={13} className="text-slate-400" />
                              <span>{b.checkIn} &rarr; {b.checkOut}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 font-serif">${b.totalAmount}</span>
                            <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                              {b.paymentStatus || 'paid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {(b.status === 'confirmed' || b.status === 'pending') && (
                              <button
                                onClick={() => handleProcessCheckIn(b._id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                              >
                                Check In
                              </button>
                            )}
                            {(b.status === 'checked-in' || b.status === 'checked_in') && (
                              <button
                                onClick={() => handleProcessCheckOut(b._id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                              >
                                Check Out
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInvoiceBooking(b)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                              title="Print Folio / Invoice"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* QUICK ACTION DRAWER / MODAL FOR ROOM BLOCKS */}
      {drawerRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-mono">
                  Room {drawerRoom.roomNumber}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {drawerRoom.name || drawerRoom.roomType} • Floor {drawerRoom.floor}
                </p>
              </div>
              <button
                onClick={() => setDrawerRoom(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold uppercase text-amber-600">{drawerRoom.status || 'available'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nightly Rate:</span>
                <span className="font-bold text-slate-900">${drawerRoom.price || drawerRoom.basePricePerNight}</span>
              </div>
              {drawerRoom.activeStay && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Checked-in Guest:</span>
                  <span className="font-semibold text-slate-900">
                    {drawerRoom.activeStay.user?.firstName} {drawerRoom.activeStay.user?.lastName}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {drawerRoom.activeStay ? (
                <>
                  <button
                    onClick={() => handleProcessCheckOut(drawerRoom.activeStay._id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    Check Out & Settle Folio
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInvoiceBooking(drawerRoom.activeStay);
                      setDrawerRoom(null);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    View Active Folio
                  </button>
                </>
              ) : (
                <>
                  {drawerRoom.status === 'cleaning' && (
                    <button
                      onClick={() => handleUpdateRoomStatusDirect(drawerRoom._id, 'available')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Mark Cleaned & Available
                    </button>
                  )}
                  {drawerRoom.status === 'available' && (
                    <button
                      onClick={() => {
                        setWalkInForm((prev) => ({ ...prev, roomNumber: drawerRoom.roomNumber }));
                        setDrawerRoom(null);
                        setShowWalkInModal(true);
                      }}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Instant Walk-In Check-In
                    </button>
                  )}
                </>
              )}

              {/* Report Maintenance Toggle */}
              <button
                onClick={() =>
                  handleUpdateRoomStatusDirect(
                    drawerRoom._id,
                    drawerRoom.status === 'maintenance' ? 'available' : 'maintenance'
                  )
                }
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-medium cursor-pointer"
              >
                {drawerRoom.status === 'maintenance' ? 'Resolve Maintenance' : 'Flag Out of Order / Maintenance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 60-SECOND WALK-IN RESERVATION MODAL (Section 7.2) */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  60-Second Walk-in Wizard
                </h3>
                <p className="text-xs text-slate-500">
                  Quick arrival registration, room key allocation & instant stay activation.
                </p>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vacant Suite</label>
                <select
                  required
                  value={walkInForm.roomNumber}
                  onChange={(e) => setWalkInForm({ ...walkInForm, roomNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                >
                  <option value="">-- Choose Vacant Room --</option>
                  {rooms
                    .filter((r) => r.status === 'available' || r.currentStatus === 'available')
                    .map((r) => (
                      <option key={r._id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.name || r.roomType}) - ${r.price}/night
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={walkInForm.guestName}
                    onChange={(e) => setWalkInForm({ ...walkInForm, guestName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone / CNIC</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555-0192"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkIn}
                    onChange={(e) => setWalkInForm({ ...walkInForm, checkIn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkOut}
                    onChange={(e) => setWalkInForm({ ...walkInForm, checkOut: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  {submittingWalkIn ? 'Allocating...' : 'Confirm Walk-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Folio Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />
    </div>
  );
};

export default AdminCheckInOut;
