import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { Printer, Mail, X, CheckCircle, AlertCircle, Clock } from './icons';
import api from '../../services/api';

/**
 * PrintableInvoice Modal
 * 
 * @param {Object} props
 * @param {Object} props.invoice - Invoice document to display/print
 * @param {Function} props.onClose - Callback to close modal
 */
const PrintableInvoice = ({ invoice, onClose }) => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  if (!invoice) return null;

  const guest = invoice.guestId || {};
  const guestName = guest.name || (guest.firstName ? `${guest.firstName} ${guest.lastName || ''}`.trim() : 'Guest');
  const guestEmail = guest.email || invoice.reservationId?.guestEmail || 'waqaskamboh269@gmail.com';
  const guestPhone = guest.phone || guest.contact || 'N/A';

  const status = (invoice.paymentStatus || 'pending').toUpperCase();
  const statusColors = {
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-rose-50 text-rose-700 border-rose-200',
    PARTIAL: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailStatus(null);
    try {
      const response = await api.post(`/payment/invoices/${invoice._id}/send-email`, {
        recipientEmail: guestEmail,
      });
      setEmailStatus({ type: 'success', message: response.data?.message || `Invoice emailed to ${guestEmail}` });
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to deliver invoice email.',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-area, #printable-invoice-area * {
            visibility: visible;
          }
          #printable-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-invoice-area"
        className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col my-8 print:my-0 print:rounded-none"
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-amber-400" />
            <span className="font-serif font-bold text-sm tracking-wide">Official Guest Invoice & Folio</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Mail size={14} />
              <span>{sendingEmail ? 'Sending Email...' : 'Email to Guest'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Email Status Alert (Hidden during print) */}
        {emailStatus && (
          <div
            className={`no-print px-6 py-3 text-xs font-semibold flex items-center justify-between ${
              emailStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <span className="flex items-center gap-2">
              {emailStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {emailStatus.message}
            </span>
            <button onClick={() => setEmailStatus(null)} className="text-current opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Invoice Body Content */}
        <div className="p-8 sm:p-10 space-y-8 bg-white">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <BrandLogo variant="light" size="lg" clickable={false} />
            <div className="text-right">
              <h2 className="text-2xl font-serif font-bold text-slate-900 uppercase tracking-wide">
                GUEST INVOICE
              </h2>
              <p className="text-xs font-mono font-semibold text-slate-500 mt-1">
                #{invoice._id?.toString().toUpperCase() || 'INV-001'}
              </p>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status] || statusColors.PENDING}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Guest & Hotel Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Billed To Guest</p>
              <h3 className="text-base font-serif font-bold text-slate-900 mt-1">{guestName}</h3>
              <p className="text-xs text-slate-600 font-mono mt-0.5">{guestEmail}</p>
              <p className="text-xs text-slate-600 mt-0.5">Phone: {guestPhone}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Hotel Details</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">LuxuryStay Grand Hotel & Resort</p>
              <p className="text-xs text-slate-600 mt-0.5">100 Ocean Promenade, Paradise Bay, FL</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Date: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 rounded-l-lg">#</th>
                  <th className="py-3 px-4">Service / Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {(invoice.lineItems || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{item.quantity || 1}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                      PKR {(item.unitPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                      PKR {(item.totalPrice || (item.unitPrice * (item.quantity || 1)) || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-500 space-y-1 max-w-xs">
              <p className="font-semibold text-slate-700">Payment Terms & Policies:</p>
              <p>Thank you for choosing LuxuryStay. All charges are billed in Pakistani Rupees (PKR).</p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  PKR {(invoice.subtotal || invoice.grandTotal || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax & Service Fees:</span>
                <span className="font-mono font-semibold text-slate-900">
                  PKR {(invoice.taxAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-300 pt-2">
                <span>Grand Total:</span>
                <span className="font-mono text-amber-700">
                  PKR {(invoice.grandTotal || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 text-xs font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono">PKR {(invoice.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-700 text-xs font-bold bg-rose-100/60 p-2 rounded">
                <span>Balance Due:</span>
                <span className="font-mono">PKR {(invoice.balanceDue || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature Bar */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-serif font-bold text-slate-800 text-sm">LuxuryStay Hospitality Concierge</p>
              <p>Support: waqaskamboh269@gmail.com | +1 (800) 555-STAY</p>
            </div>
            <div className="text-right border-t border-slate-300 pt-2 w-44">
              <p className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
