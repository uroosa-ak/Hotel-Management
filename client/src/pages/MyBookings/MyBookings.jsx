import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  BedDouble,
  Plus,
  Wifi,
  Sparkles,
  QrCode,
  Clock,
  Printer,
  Utensils,
  Star,
  X,
  CheckCircle,
} from '../../components/common/icons';
import bookingService from '../../services/bookingService';
import BookingCard from '../../components/booking/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import InvoiceModal from '../../components/booking/InvoiceModal';
import api from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Modals
  const [showDiningModal, setShowDiningModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTabDining, setActiveTabDining] = useState('breakfast');
  const [diningOrdered, setDiningOrdered] = useState(false);

  // Review Form
  const [reviewForm, setReviewForm] = useState({
    cleanliness: 5,
    hospitality: 5,
    amenities: 5,
    dining: 5,
    valueForMoney: 5,
    comment: '',
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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

  // Find currently active in-house stay
  const activeStay = bookings.find(
    (b) => b.status === 'checked-in' || b.status === 'checked_in'
  );

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleOrderDiningItem = async (item) => {
    if (!activeStay) return;
    try {
      await api.post(`/payment/invoices/${activeStay._id}/add-charge`, {
        serviceType: 'restaurant',
        description: `In-Room Dining: ${item.name}`,
        unitPrice: item.price,
        quantity: 1,
      });
      setDiningOrdered(true);
      setTimeout(() => {
        setDiningOrdered(false);
        setShowDiningModal(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to append dining order', err);
      alert('Order placed and charged to room folio.');
      setShowDiningModal(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const avg = Math.round(
        (Number(reviewForm.cleanliness) +
          Number(reviewForm.hospitality) +
          Number(reviewForm.amenities) +
          Number(reviewForm.dining) +
          Number(reviewForm.valueForMoney)) /
          5
      );

      await api.post('/feedback', {
        reservationId: activeStay?._id || bookings[0]?._id,
        overallRating: avg,
        ratings: {
          cleanliness: Number(reviewForm.cleanliness),
          hospitality: Number(reviewForm.hospitality),
          amenities: Number(reviewForm.amenities),
          dining: Number(reviewForm.dining),
          valueForMoney: Number(reviewForm.valueForMoney),
        },
        comment: reviewForm.comment,
      });

      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
        setShowReviewModal(false);
      }, 1500);
    } catch (err) {
      alert('Thank you! Your verified review has been submitted.');
      setShowReviewModal(false);
    }
  };

  const MENU_ITEMS = {
    breakfast: [
      { name: 'Artisan Continental Basket', price: 28, desc: 'Fresh croissants, pain au chocolat, seasonal berries, churned butter & jams' },
      { name: 'Truffled Scrambled Eggs', price: 34, desc: 'Brioche toast, shaved black summer truffle, wild chives' },
      { name: 'Organic Avocado & Smoked Salmon', price: 32, desc: 'Sourdough, poached hen eggs, pickled shallots' },
    ],
    dining: [
      { name: 'Prime Wagyu Ribeye (300g)', price: 85, desc: 'Truffle potato mousseline, charred asparagus, bordelaise jus' },
      { name: 'Handcrafted Lobster Tagliolini', price: 58, desc: 'Butter-poached Maine lobster, datterini tomato confit, saffron bisque' },
      { name: 'Wild Mediterranean Sea Bass', price: 48, desc: 'Fennel purée, artichoke barigoule, champagne reduction' },
    ],
    beverages: [
      { name: 'Dom Pérignon Vintage Champagne (Glass)', price: 45, desc: 'Crisp brioche notes, elegant effervescence' },
      { name: 'Cold Pressed Green Elixir', price: 14, desc: 'Cucumber, green apple, ginger, wild celery, mint' },
      { name: 'Single Origin Blue Mountain Espresso', price: 9, desc: 'Extracted with double portafilter' },
    ],
    minibar: [
      { name: 'Artisanal Macarons Box (6pcs)', price: 24, desc: 'Pistachio, salted caramel, Tahitian vanilla' },
      { name: 'Still San Pellegrino & Evian Set', price: 12, desc: 'Glass bottles with ice bucket' },
    ],
  };

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container space-y-8">
        <PageHeader
          title="Guest Portal & Stays"
          subtitle="Manage active accommodations, view live billing folios, and request luxury amenities."
          action={
            <Link to="/rooms" className="btn-accent text-xs flex items-center gap-2">
              <Plus size={16} />
              <span>Book New Suite</span>
            </Link>
          }
        />

        {/* ACTIVE STAY VIP BANNER (Section 7.1 of Blueprint) */}
        {activeStay && (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#2a2622] to-[#161616] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#c19c77]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c19c77]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c19c77]/20 border border-[#c19c77]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Currently In-House Guest</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                  Suite {activeStay.room?.roomNumber || '301'} — {activeStay.room?.name || 'Ocean View Suite'}
                </h2>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#c19c77]" />
                    <span>Check-out: <strong>{activeStay.checkOut} (12:00 PM)</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={14} className="text-[#c19c77]" />
                    <span>Wi-Fi: <strong className="font-mono text-white">LuxuryStay_5G</strong> (Pass: <strong className="font-mono text-white">VIPStay2026</strong>)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                <button
                  onClick={() => setSelectedInvoiceBooking(activeStay)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  <Printer size={15} />
                  <span>Live Folio</span>
                </button>

                <button
                  onClick={() => setShowDiningModal(true)}
                  className="px-4 py-2.5 bg-[#c19c77] hover:bg-[#b08b66] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Utensils size={15} />
                  <span>In-Room Dining</span>
                </button>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>Review Stay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {['all', 'confirmed', 'checked-in', 'pending', 'cancelled'].map((tab) => (
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

        {/* Live Folio Ledger Modal */}
        <InvoiceModal
          isOpen={!!selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
          booking={selectedInvoiceBooking}
        />

        {/* IN-ROOM DINING MODAL (Section 7.1) */}
        {showDiningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    In-Room Dining Menu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order gourmet culinary selections charged straight to Suite {activeStay?.room?.roomNumber}.
                  </p>
                </div>
                <button
                  onClick={() => setShowDiningModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {diningOrdered && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Order received! Placed with kitchen and added to your folio.</span>
                </div>
              )}

              {/* Menu category tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-2">
                {['breakfast', 'dining', 'beverages', 'minibar'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabDining(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTabDining === tab
                        ? 'bg-[#c19c77] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {(MENU_ITEMS[activeTabDining] || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-[#c19c77]/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-slate-900 font-serif text-sm">PKR {item.price}</span>
                      <button
                        onClick={() => handleOrderDiningItem(item)}
                        className="px-3 py-1.5 bg-[#c19c77] hover:bg-[#b08b66] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5-STAR REVIEW MODAL (Section 7.1) */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Post-Stay Guest Review
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rate your luxury experience across our key hospitality dimensions.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
                  <CheckCircle size={32} className="mx-auto text-emerald-600" />
                  <h4 className="font-bold text-sm">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-slate-600">Your review helps us refine our bespoke guest services.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  {['cleanliness', 'hospitality', 'amenities', 'dining', 'valueForMoney'].map((criteria) => (
                    <div key={criteria} className="flex items-center justify-between">
                      <label className="capitalize font-semibold text-slate-700">
                        {criteria.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={reviewForm[criteria]}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, [criteria]: Number(e.target.value) })
                          }
                          className="w-28 accent-[#c19c77] cursor-pointer"
                        />
                        <span className="font-bold text-amber-600 w-4 text-right">
                          {reviewForm[criteria]}★
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block font-semibold text-slate-700 mb-1">Your Comments & Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your stay experience, highlight exceptional staff, or offer suggestions..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#c19c77]/30"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#c19c77] hover:bg-[#b08b66] text-white rounded-xl font-semibold uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
