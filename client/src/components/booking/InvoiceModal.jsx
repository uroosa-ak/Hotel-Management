import React from 'react';
import { X, Printer, Shield, CheckCircle } from '../common/icons';

const InvoiceModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const roomPrice = booking.room?.pricePerNight || booking.room?.price || 200;
  const nights = 3; // Estimated or calculated from dates
  const roomSubtotal = booking.totalAmount ? Math.round(booking.totalAmount * 0.85) : roomPrice * nights;
  const serviceCharges = Math.round(roomSubtotal * 0.05);
  const tax = (booking.totalAmount || (roomSubtotal + serviceCharges)) - roomSubtotal - serviceCharges;
  const finalTotal = booking.totalAmount || (roomSubtotal + serviceCharges + tax);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Shield size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide uppercase">LuxuryStay Hospitality</h3>
              <p className="text-[11px] text-amber-400">Official Guest Folio & Invoice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Print Folio"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-6 text-xs text-slate-600">
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Billed To</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">
                {booking.user?.firstName || 'Valued Guest'} {booking.user?.lastName || ''}
              </h4>
              <p className="text-slate-500 mt-0.5">{booking.user?.email || 'guest@luxurystay.com'}</p>
              <p className="text-slate-500">{booking.user?.phone || '+1 (555) 019-2834'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Invoice Details</span>
              <p className="font-mono text-slate-800 font-semibold mt-1">
                INV-{booking._id ? String(booking._id).slice(-6).toUpperCase() : '847291'}
              </p>
              <p className="text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle size={12} />
                <span>{booking.paymentStatus === 'paid' ? 'Paid in Full' : 'Settlement Pending'}</span>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Suite Reserved</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.room?.name || 'Deluxe Suite'}</p>
              <p className="text-[11px] text-slate-500">Room {booking.room?.roomNumber || '101'}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Check-In</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.checkIn || '2026-09-12'}</p>
              <p className="text-[11px] text-slate-500">From 2:00 PM</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Check-Out</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.checkOut || '2026-09-15'}</p>
              <p className="text-[11px] text-slate-500">Until 11:00 AM</p>
            </div>
          </div>

          {/* Itemized Charges */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-medium text-slate-800">
                  Suite Accommodation ({booking.room?.name || 'Deluxe Suite'})
                </td>
                <td className="py-3 text-center">${roomPrice}/night</td>
                <td className="py-3 text-right font-semibold text-slate-900">${roomSubtotal}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-800">Hospitality & Amenities Service Charge (5%)</td>
                <td className="py-3 text-center">Standard</td>
                <td className="py-3 text-right font-semibold text-slate-900">${serviceCharges}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-800">State & Tourism Taxes</td>
                <td className="py-3 text-center">Configured</td>
                <td className="py-3 text-right font-semibold text-slate-900">${tax > 0 ? tax : 45}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 text-sm">
                <td colSpan={2} className="py-4 font-bold text-slate-900 font-serif">Grand Total</td>
                <td className="py-4 text-right font-bold text-slate-900 font-serif">${finalTotal}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Thank you for staying at LuxuryStay Hospitality. We hope you enjoyed your luxurious stay!
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
