import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Printer, Mail } from '../../components/common/icons';
import paymentService from '../../services/paymentService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableInvoice from '../../components/common/PrintableInvoice';

const AdminPayments = () => {
  const [tab, setTab] = useState('invoices'); // invoices | payments
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settleModal, setSettleModal] = useState(null); // invoice object
  const [settleForm, setSettleForm] = useState({ amountPaid: '', paymentMethod: 'cash' });
  const [printInvoiceModal, setPrintInvoiceModal] = useState(null);

  const fetchAll = async () => {
    try {
      const [inv, pay] = await Promise.all([
        paymentService.getAllInvoices(),
        paymentService.getAll(),
      ]);
      setInvoices(inv);
      setPayments(pay);
    } catch (err) {
      console.error('Failed to load billing data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openSettle = (invoice) => {
    setSettleForm({ amountPaid: invoice.balanceDue || invoice.grandTotal, paymentMethod: 'cash' });
    setSettleModal(invoice);
  };

  const handleSettle = async (e) => {
    e.preventDefault();
    try {
      await paymentService.settleInvoice(settleModal._id, {
        amountPaid: Number(settleForm.amountPaid),
        paymentMethod: settleForm.paymentMethod,
      });
      setSettleModal(null);
      await fetchAll();
    } catch (err) {
      console.error('Failed to settle invoice', err);
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Issue a full refund for this payment?')) return;
    try {
      await paymentService.refund(paymentId);
      await fetchAll();
    } catch (err) {
      console.error('Failed to refund payment', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Billing & Payments"
        subtitle="Review guest folios, settle balances, send email invoices, and print official bills."
      />

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'invoices' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Folios / Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'payments' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payments ({payments.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading billing data..." />
      ) : tab === 'invoices' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Balance Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <FileText size={28} className="mx-auto mb-2 text-slate-300" />No invoices generated yet.
                  </td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{inv.invoiceNumber || inv._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {inv.guestId?.firstName || inv.guestId?.name || inv.guestId?.username || 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-semibold font-mono text-slate-900">
                      PKR {inv.grandTotal?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold font-mono text-rose-700">
                      PKR {inv.balanceDue?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={inv.paymentStatus} /></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setPrintInvoiceModal(inv)}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="View and print invoice"
                      >
                        <Printer size={13} />
                        <span>Print / Email</span>
                      </button>
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => openSettle(inv)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Settle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <CreditCard size={28} className="mx-auto mb-2 text-slate-300" />No payment records found.
                  </td></tr>
                ) : payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold font-mono text-slate-900">
                      PKR {p.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 capitalize">{p.paymentMethod?.replace('-', ' ')}</td>
                    <td className="px-6 py-4 font-mono text-[11px]">{p.transactionId || '—'}</td>
                    <td className="px-6 py-4">{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.paymentStatus} /></td>
                    <td className="px-6 py-4 text-right">
                      {p.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleRefund(p._id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settle Modal */}
      {settleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <CreditCard size={18} className="text-amber-600" /> Settle Invoice #{settleModal.invoiceNumber || settleModal._id?.slice(-6).toUpperCase()}
            </h3>
            <form onSubmit={handleSettle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount Received (PKR)</label>
                <input type="number" step="0.01" min="0" required className="input-field py-2 font-mono"
                  value={settleForm.amountPaid}
                  onChange={(e) => setSettleForm({ ...settleForm, amountPaid: e.target.value })} />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                <select className="input-field py-2" value={settleForm.paymentMethod}
                  onChange={(e) => setSettleForm({ ...settleForm, paymentMethod: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="stripe">Stripe</option>
                  <option value="wire_transfer">Wire Transfer</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSettleModal(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm cursor-pointer">Confirm & Send Email</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {printInvoiceModal && (
        <PrintableInvoice
          invoice={printInvoiceModal}
          onClose={() => setPrintInvoiceModal(null)}
        />
      )}
    </div>
  );
};

export default AdminPayments;
