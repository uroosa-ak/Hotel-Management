import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, CheckCircle, XCircle } from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Cancel / delete state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'cancel', // 'cancel' | 'delete'
    bookingId: null,
  });

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admin bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
        {['all', 'confirmed', 'checked_in', 'checked_out', 'pending', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab.replace(/_/g, ' ')}
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
                          <option value="checked_in">Checked In</option>
                          <option value="checked_out">Checked Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
