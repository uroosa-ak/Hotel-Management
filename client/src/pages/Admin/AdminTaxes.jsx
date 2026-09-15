import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Percent, Edit } from '../../components/common/icons';
import taxService from '../../services/taxService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = { taxName: '', rate: '', type: 'percentage', isActive: true };

const AdminTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchTaxes = async () => {
    try {
      setTaxes(await taxService.getAll());
    } catch (err) {
      console.error('Failed to load taxes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTaxes(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditingId(t._id);
    setForm({
      taxName: t.taxName || '',
      rate: t.rate || '',
      type: t.type || 'percentage',
      isActive: t.isActive !== false,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, rate: Number(form.rate) };
      if (editingId) {
        await taxService.update(editingId, payload);
      } else {
        await taxService.create(payload);
      }
      setShowModal(false);
      setForm(emptyForm);
      await fetchTaxes();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save tax rule');
    }
  };

  const toggleActive = async (t) => {
    try {
      await taxService.update(t._id, { isActive: !t.isActive });
      await fetchTaxes();
    } catch (err) {
      console.error('Failed to toggle tax', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tax rule?')) return;
    try {
      await taxService.delete(id);
      await fetchTaxes();
    } catch (err) {
      console.error('Failed to delete tax', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Configuration"
        subtitle="Manage tax rates applied to bookings, folios, and invoices."
        action={
          <button onClick={openCreate} className="btn-accent text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus size={16} /> <span>New Tax Rule</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading tax configuration..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Tax Name</th>
                  <th className="px-6 py-4">Rate</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxes.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Percent size={28} className="mx-auto mb-2 text-slate-300" />No tax rules configured.
                  </td></tr>
                ) : taxes.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{t.taxName}</td>
                    <td className="px-6 py-4">{t.rate}{t.type === 'percentage' ? '%' : ''}</td>
                    <td className="px-6 py-4 capitalize">{t.type}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(t)} className="cursor-pointer">
                        <StatusBadge status={t.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">{editingId ? 'Edit Tax Rule' : 'New Tax Rule'}</h3>
            {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tax Name</label>
                <input required placeholder="e.g. VAT, Service Tax" className="input-field py-2" value={form.taxName} onChange={(e) => setForm({ ...form, taxName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rate</label>
                  <input type="number" min="0" required className="input-field py-2" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type</label>
                  <select className="input-field py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm">{editingId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTaxes;
