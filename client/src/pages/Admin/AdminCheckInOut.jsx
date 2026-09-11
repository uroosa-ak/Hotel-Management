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
} from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InvoiceModal from '../../components/booking/InvoiceModal';

const AdminCheckInOut = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('arrivals'); // 'arrivals' | 'in_house' | 'all'
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load check-in roster', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleProcessCheckIn = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'checked-in');
      await fetchBookings();
    } catch (err) {
      console.error('Check-in failed', err);
    }
  };

  const handleProcessCheckOut = async (bookingId) => {
    try {
      await bookingService.updateStatus(bookingId, 'checked-out');
      await fetchBookings();
    } catch (err) {
      console.error('Check-out failed', err);
    }
  };

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Front Desk & Check-In / Check-Out"
        subtitle="Manage guest arrivals, room key assignment, departures, and generate itemized billing folios."
      />

      {/* Action and Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'arrivals'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Arrivals & Reservations
          </button>
          <button
            onClick={() => setActiveTab('in_house')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'in_house'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In-House Guests (Check-Out)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Stays
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guest or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {/* Roster Table */}
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
                        {/* Process Check-in Button */}
                        {(b.status === 'confirmed' || b.status === 'pending') && (
                          <button
                            onClick={() => handleProcessCheckIn(b._id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          >
                            Check In
                          </button>
                        )}

                        {/* Process Check-out Button */}
                        {(b.status === 'checked-in' || b.status === 'checked_in') && (
                          <button
                            onClick={() => handleProcessCheckOut(b._id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          >
                            Check Out
                          </button>
                        )}

                        {/* View/Print Folio Button */}
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
