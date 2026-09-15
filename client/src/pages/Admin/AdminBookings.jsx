import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, CheckCircle, XCircle, BedDouble } from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import roomService from '../../services/roomService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [manageModal, setManageModal] = useState(null); // booking being managed
  const [manageForm, setManageForm] = useState({ roomId: '', checkIn: '', checkOut: '' });
  const [manageError, setManageError] = useState('');

  // Cancel / delete state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'cancel', // 'cancel' | 'delete'
    bookingId: null,
  });

  const fetchBookings = async () => {
    try {
      const [data, roomData] = await Promise.all([bookingService.getAll(), roomService.getAll()]);
      setBookings(Array.isArray(data) ? data : []);
      setRooms(Array.isArray(roomData) ? roomData : []);
    } catch (err) {
      console.error('Failed to load admin bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openManage = (b) => {
    setManageModal(b);
    setManageForm({ roomId: b.room?._id || '', checkIn: b.checkIn || '', checkOut: b.checkOut || '' });
    setManageError('');
  };

  const handleReassign = async () => {
    try {
      await bookingService.reassignRoom(manageModal._id, manageForm.roomId);
      setManageError('');
      await fetchBookings();
    } catch (err) {
      setManageError(err.message || 'Failed to reassign room');
    }
  };

  const handleUpdateDates = async () => {
    try {
      await bookingService.updateDates(manageModal._id, manageForm.checkIn, manageForm.checkOut);
      setManageModal(null);
      await fetchBookings();
    } catch (err) {
      setManageError(err.message || 'Failed to update stay dates');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingService.updateStatus(id, newStatus);
      await fetchBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleConfirmAction = async () => {
    if (!dialogState.bookingId) return;
    if (dialogState.type === 'delete') {
      await bookingService.delete(dialogState.bookingId);
    } else {
      await bookingService.cancel(dialogState.bookingId);
    }
    setDialogState({ isOpen: false, type: 'cancel', bookingId: null });
    await fetchBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservation Roster & Check-ins"
        subtitle="Manage guest arrivals, update reservation lifecycle states, and oversee check-outs."
      />

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {['all', 'confirmed', 'checked-in', 'checked-out', 'pending', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading guest reservations..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Guest Details</th>
                  <th className="px-6 py-4">Room / Suite</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">
                      {b._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">
                        {b.user?.firstName} {b.user?.lastName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block">{b.user?.email}</span>
                      <span className="text-[11px] text-slate-400">{b.user?.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">
                        {b.room?.name || 'Suite'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Room #{b.room?.roomNumber || '101'} &bull; {b.guests} Guests
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {b.checkIn} &rarr; {b.checkOut}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">${b.totalAmount}</span>
                      <span className="block mt-0.5">
                        <StatusBadge status={b.paymentStatus || 'paid'} />
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          className="input-field w-auto py-1 px-2 text-xs bg-slate-50"
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked-in">Checked In</option>
                          <option value="checked-out">Checked Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => openManage(b)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Reassign Room / Extend Stay"
                        >
                          <BedDouble size={15} />
                        </button>
                        <button
                          onClick={() =>
                            setDialogState({ isOpen: true, type: 'delete', bookingId: b._id })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {manageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Manage Reservation {manageModal._id.slice(-6).toUpperCase()}
            </h3>
            {manageError && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{manageError}</p>}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reassign Room</label>
                <div className="flex gap-2">
                  <select
                    className="input-field py-2 flex-1"
                    value={manageForm.roomId}
                    onChange={(e) => setManageForm({ ...manageForm, roomId: e.target.value })}
                  >
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>Room {r.roomNumber} — {r.roomType}</option>
                    ))}
                  </select>
                  <button onClick={handleReassign} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer">
                    Reassign
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Extend / Shorten Stay</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="input-field py-2" value={manageForm.checkIn}
                    onChange={(e) => setManageForm({ ...manageForm, checkIn: e.target.value })} />
                  <input type="date" className="input-field py-2" value={manageForm.checkOut}
                    onChange={(e) => setManageForm({ ...manageForm, checkOut: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setManageModal(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                Close
              </button>
              <button onClick={handleUpdateDates} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm">
                Save Dates
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.type === 'delete' ? 'Delete Reservation' : 'Cancel Reservation'}
        message="Are you sure you want to perform this action? This will update the reservation ledger."
        confirmText="Confirm Action"
        onConfirm={handleConfirmAction}
        onClose={() => setDialogState({ isOpen: false, type: 'cancel', bookingId: null })}
      />
    </div>
  );
};

export default AdminBookings;
