import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BedDouble, Plus } from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import BookingCard from '../../components/booking/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Cancel dialog state
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    bookingId: null,
    isProcessing: false,
  });

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancel = (id) => {
    setCancelModal({
      isOpen: true,
      bookingId: id,
      isProcessing: false,
    });
  };

  const handleConfirmCancel = async () => {
    setCancelModal((prev) => ({ ...prev, isProcessing: true }));
    try {
      await bookingService.cancel(cancelModal.bookingId);
      await fetchBookings();
      setCancelModal({ isOpen: false, bookingId: null, isProcessing: false });
    } catch (err) {
      console.error('Failed to cancel booking', err);
      setCancelModal((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container">
        <PageHeader
          title="My Reservations"
          subtitle="View and manage your upcoming stays, active reservations, and past hotel booking history."
          action={
            <Link to="/rooms" className="btn-accent text-xs flex items-center gap-2">
              <Plus size={16} />
              <span>Book New Suite</span>
            </Link>
          }
        />

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
          {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading your reservations..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Bookings Found"
            message={
              filter === 'all'
                ? "You haven't made any hotel reservations yet. Plan your next luxury getaway today!"
                : `You don't have any bookings matching the "${filter}" filter.`
            }
            action={
              <Link to="/rooms" className="btn-primary text-xs">
                Explore Available Suites
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleOpenCancel}
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <ConfirmDialog
          isOpen={cancelModal.isOpen}
          title="Cancel Hotel Reservation"
          message="Are you sure you want to cancel this reservation? Depending on your check-in date, cancellation terms will apply."
          confirmText="Yes, Cancel Booking"
          isLoading={cancelModal.isProcessing}
          onConfirm={handleConfirmCancel}
          onClose={() =>
            setCancelModal({ isOpen: false, bookingId: null, isProcessing: false })
          }
        />
      </div>
    </div>
  );
};

export default MyBookings;
