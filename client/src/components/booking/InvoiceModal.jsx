import React, { useState, useEffect } from 'react';
import { X, Printer, Shield, CheckCircle } from '../common/icons';
import paymentService from '../../services/paymentService';

const InvoiceModal = ({ isOpen, onClose, booking }) => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (!isOpen || !booking?._id) {
      setInvoice(null);
      return;
    }
    paymentService.getInvoice(booking._id).then(setInvoice).catch(() => setInvoice(null));
  }, [isOpen, booking?._id]);

  if (!isOpen || !booking) return null;

  const roomPrice = booking.room?.pricePerNight || booking.room?.price || 200;

  // Dynamically calculate nights from booking check-in & check-out dates
  const d1 = booking.checkIn ? new Date(booking.checkIn) : new Date();
  const d2 = booking.checkOut ? new Date(booking.checkOut) : new Date(Date.now() + 86400000);
  const diffTime = Math.abs(d2 - d1);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Prefer the server-authoritative folio invoice (real line items, real balance)
  // over a client-side recompute; fall back only if no invoice record exists yet.
  const roomSubtotal = invoice?.subtotal ?? roomPrice * nights;
  const taxAmount = invoice ? invoice.taxAmount : parseFloat((roomSubtotal * 0.16).toFixed(2));
  const grandTotal = invoice ? invoice.grandTotal : parseFloat((roomSubtotal + taxAmount).toFixed(2));
  const isPaid = invoice ? invoice.paymentStatus === 'paid' : booking.paymentStatus === 'paid';
  const amountPaid = invoice ? invoice.amountPaid : (isPaid ? grandTotal : (booking.depositPaid || 0));
  const balanceDue = invoice ? invoice.balanceDue : parseFloat(Math.max(0, grandTotal - amountPaid).toFixed(2));
  const lineItems = invoice?.lineItems?.length
    ? invoice.lineItems
    : [{ description: `Suite Accommodation (${booking.room?.name || 'Deluxe Suite'})`, unitPrice: roomPrice, quantity: nights, totalPrice: roomSubtotal }];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div 
        id="printable-folio"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 print:my-0 print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between print:bg-slate-900 print:text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl print:border print:border-amber-400">
              <Shield size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide uppercase font-serif">LuxuryStay Hospitality</h3>
              <p className="text-[11px] text-amber-400">Official Guest Folio & Invoiced Statement</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3"
              title="Print Folio via Browser"
            >
              <Printer size={16} />
              <span>Print Folio</span>
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
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Folio Reference</span>
              <p className="font-mono text-slate-800 font-bold mt-1 text-sm">
                LS-INV-{booking._id ? String(booking._id).slice(-6).toUpperCase() : '847291'}
              </p>
              <p className="text-slate-500">Issued: {new Date().toLocaleDateString()}</p>
              <div className={`mt-2 inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full border text-[11px] ${
                isPaid 
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                <CheckCircle size={12} />
                <span>{isPaid ? 'Paid in Full' : 'Settlement Pending'}</span>
              </div>
            </div>
          </div>

          {/* Reservation Breakdown Details */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Accommodations</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.room?.name || 'Deluxe Ocean Suite'}</p>
              <p className="text-[11px] text-slate-500">Suite #{booking.room?.roomNumber || '101'}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Check-In</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.checkIn || '2026-09-15'}</p>
              <p className="text-[11px] text-slate-500">Standard Check-In (2:00 PM)</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Check-Out</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.checkOut || '2026-09-18'}</p>
              <p className="text-[11px] text-slate-500">Duration: {nights} Night(s)</p>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Unit Rate</th>
                <th className="py-2.5 text-center">Quantity</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.map((item, i) => (
                <tr key={item._id || i}>
                  <td className="py-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 text-center">${Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right font-semibold text-slate-900">${Number(item.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-medium text-slate-800">
                  Hospitality Goods & Services Tax ({invoice?.taxPercent ?? 16}% Statutory GST)
                </td>
                <td className="py-3 text-center">{invoice?.taxPercent ?? 16}%</td>
                <td className="py-3 text-center">Auto-Computed</td>
                <td className="py-3 text-right font-semibold text-slate-900">${taxAmount.toFixed(2)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={3} className="pt-3 font-semibold text-slate-600 text-right">Subtotal:</td>
                <td className="pt-3 text-right font-semibold text-slate-900">${roomSubtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 font-semibold text-slate-600 text-right">Tax Total (16%):</td>
                <td className="py-1 text-right font-semibold text-slate-900">${taxAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-t-2 border-slate-900 text-sm">
                <td colSpan={3} className="py-3 font-bold text-slate-900 font-serif text-right">Grand Total:</td>
                <td className="py-3 text-right font-bold text-slate-900 font-serif">${grandTotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-50 font-bold text-xs">
                <td colSpan={3} className="py-2.5 px-2 text-right text-slate-700">Balance Due:</td>
                <td className="py-2.5 px-2 text-right font-mono text-amber-700">${balanceDue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Thank you for staying at LuxuryStay Hospitality. For folio inquiries, please contact our Front Desk.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
