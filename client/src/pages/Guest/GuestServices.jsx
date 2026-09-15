import React, { useState, useEffect } from 'react';
import { Utensils, Plus } from '../../components/common/icons';
import serviceRequestService from '../../services/serviceRequestService';
import bookingService from '../../services/bookingService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORY_LABELS = {
  in_room_dining: 'In-Room Dining',
  wake_up_call: 'Wake-Up Call',
  luggage_assistance: 'Luggage Assistance',
  airport_transfer: 'Airport Transfer',
  extra_linen: 'Extra Linen',
  laundry_pickup: 'Laundry Pickup',
  other: 'Other Request',
};

const GuestServices = () => {
  const [catalog, setCatalog] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ serviceCategory: 'in_room_dining', requestDetails: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [cat, mine, bookings] = await Promise.all([
        serviceRequestService.getCatalog(),
        serviceRequestService.getMine(),
        bookingService.getMyBookings(),
      ]);
      setCatalog(cat);
      setMyRequests(mine);
      const current = bookings.find((b) => ['confirmed', 'checked-in'].includes(b.bookingStatus)) || bookings[0];
      setActiveBooking(current || null);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBooking) {
      setError('You need an active or upcoming reservation to request a service.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await serviceRequestService.create({
        roomId: activeBooking.room?._id || activeBooking.room,
        reservationId: activeBooking._id,
        serviceCategory: form.serviceCategory,
        requestDetails: form.requestDetails,
      });
      setForm({ serviceCategory: 'in_room_dining', requestDetails: '' });
      await fetchAll();
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading services..." />;

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container max-w-4xl">
        <PageHeader
          title="Guest Services"
          subtitle="Request in-room dining, laundry, wake-up calls, and more during your stay."
        />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={16} /> Request a Service
          </h3>
          {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <select
              className="input-field py-2 sm:col-span-1"
              value={form.serviceCategory}
              onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
            >
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <input
              required
              placeholder="Describe your request..."
              className="input-field py-2 sm:col-span-1"
              value={form.requestDetails}
              onChange={(e) => setForm({ ...form, requestDetails: e.target.value })}
            />
            <button type="submit" disabled={submitting} className="btn-accent py-2 text-xs sm:col-span-1 disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">My Requests</h3>
          </div>
          {myRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Utensils size={28} className="mx-auto mb-2 text-slate-300" />
              You haven't requested any services yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myRequests.map((r) => (
                <div key={r._id} className="px-6 py-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{CATEGORY_LABELS[r.serviceCategory] || r.serviceCategory}</p>
                    <p className="text-slate-500 mt-0.5">{r.requestDetails}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestServices;
