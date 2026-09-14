import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
  BedDouble,
  Info,
} from '../../components/common/icons';
import { useAuth } from '../../context/AuthContext';
import roomService from '../../services/roomService';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState('');

  // Default dates: tomorrow to +4 days
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fourDaysLater = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    checkIn: tomorrow,
    checkOut: fourDaysLater,
    guests: '2',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
    paymentMethod: 'credit-card',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchRoom = async () => {
      try {
        let roomData = null;
        if (id) {
          roomData = await roomService.getById(id);
        } else {
          const all = await roomService.getAll();
          roomData = all?.[0] || null;
        }
        if (isMounted) {
          setRoom(roomData);
        }
      } catch (err) {
        console.error('Error loading booking room', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRoom();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Calculate nights and total amount
  const calculatePricing = () => {
    if (!room) return { nights: 1, roomTotal: 0, taxes: 0, total: 0 };
    const d1 = new Date(formData.checkIn);
    const d2 = new Date(formData.checkOut);
    const diffTime = Math.abs(d2 - d1);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const roomTotal = nights * (room.pricePerNight || 200);
    const taxes = Math.round(roomTotal * 0.12);
    const resortFee = 25 * nights;
    const total = roomTotal + taxes + resortFee;
    return { nights, roomTotal, taxes, resortFee, total };
  };

  const pricing = calculatePricing();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    try {
      // Guest identity, pricing and status are all decided server-side from the
      // signed-in account - only the stay details are sent.
      const payload = {
        room: room._id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests, 10),
        specialRequests: formData.specialRequests,
      };

      const result = await bookingService.create(payload);
      setBookingSuccess(result);
    } catch (err) {
      setError(err?.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Preparing booking form..." />;

  if (bookingSuccess) {
    return (
      <div className="app-shell bg-background min-h-screen py-16">
        <div className="page-container max-w-2xl text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-6">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <CheckCircle size={48} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 font-serif">
              Reservation Confirmed!
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              Thank you for choosing LuxuryStay. Your reservation for{' '}
              <strong className="text-slate-900">{room?.name}</strong> has been received and is
              awaiting confirmation from our front desk.
            </p>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Reservation ID:</span>
                <span className="font-mono font-bold text-slate-900">{bookingSuccess._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold text-slate-900">
                  {formData.checkIn} to {formData.checkOut} ({pricing.nights} nights)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total (room charge):</span>
                <span className="font-bold text-accent">${bookingSuccess.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-slate-900 capitalize">{bookingSuccess.status}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link to="/my-bookings" className="btn-accent px-6 py-3 text-sm">
                View My Reservations
              </Link>
              <Link to="/" className="btn-secondary px-6 py-3 text-sm">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container">
        <Link
          to={room ? `/rooms/${room._id}` : '/rooms'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Room Details</span>
        </Link>

        <PageHeader
          title="Complete Your Reservation"
          subtitle="Finalize your guest information and stay preferences for an extraordinary holiday."
        />

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dates & Guests */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={18} className="text-amber-600" />
                  <span>1. Stay Dates & Party Size</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      min={tomorrow}
                      className="input-field"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      min={formData.checkIn || tomorrow}
                      className="input-field"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Number of Guests
                    </label>
                    <select
                      className="input-field"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Users size={18} className="text-amber-600" />
                  <span>2. Primary Guest Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John"
                      className="input-field"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Doe"
                      className="input-field"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Special Requests & Preferences (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Early check-in request, high floor, quiet room, dietary preferences..."
                    className="input-field resize-none"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={18} className="text-amber-600" />
                  <span>3. Payment & Guarantee</span>
                </h3>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-start gap-3">
                  <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Your booking is guaranteed instantly. No immediate card charge is required for standard flexible rate reservations; payment is settled at check-in or online.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 sticky top-28 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100 font-serif">
                  Reservation Summary
                </h3>

                {room && (
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        room.images?.[0] ||
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&auto=format&fit=crop'
                      }
                      alt={room.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-600">
                        {room.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{room.name}</h4>
                      <p className="text-xs text-slate-500">${room.pricePerNight} / night</p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      ${room?.pricePerNight || 0} × {pricing.nights} night(s)
                    </span>
                    <span className="font-semibold text-slate-900">${pricing.roomTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Resort & Amenities Fee</span>
                    <span className="font-semibold text-slate-900">${pricing.resortFee}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>State & Luxury Taxes (12%)</span>
                    <span className="font-semibold text-slate-900">${pricing.taxes}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-amber-600 text-xl font-serif">${pricing.total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent w-full py-4 text-sm font-bold shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Confirm & Book Reservation'}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <Shield size={14} className="text-amber-600" />
                  <span>Free cancellation up to 48 hours before check-in</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
