import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Edit } from '../../components/common/icons';
import promotionService from '../../services/promotionService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = { code: '', description: '', discountPercentage: '', validFrom: '', validTo: '', isActive: true };

const AdminPromotions = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchPromos = async () => {
    try {
      setPromos(await promotionService.getAll());
    } catch (err) {
      console.error('Failed to load promotions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      code: p.code || '',
      description: p.description || '',
      discountPercentage: p.discountPercentage || '',
      validFrom: p.validFrom ? new Date(p.validFrom).toISOString().split('T')[0] : '',
      validTo: p.validTo ? new Date(p.validTo).toISOString().split('T')[0] : '',
      isActive: p.isActive !== false,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description,
        discountPercentage: Number(form.discountPercentage),
        isActive: form.isActive,
      };
      if (form.validFrom) payload.validFrom = form.validFrom;
      if (form.validTo) payload.validTo = form.validTo;

      if (editingId) {
        await promotionService.update(editingId, payload);
      } else {
        await promotionService.create(payload);
      }
      setShowModal(false);
      setForm(emptyForm);
      await fetchPromos();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save promotion');
    }
  };

  const toggleActive = async (p) => {
    try {
      await promotionService.update(p._id, { isActive: !p.isActive });
      await fetchPromos();
    } catch (err) {
      console.error('Failed to toggle promotion', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion code?')) return;
    try {
      await promotionService.delete(id);
      await fetchPromos();
    } catch (err) {
      console.error('Failed to delete promotion', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions & Discounts"
        subtitle="Create promo codes and manage discount campaigns applied at booking time."
        action={
          <button onClick={openCreate} className="btn-accent text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus size={16} /> <span>New Promo Code</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading promotions..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Valid Period</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promos.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Tag size={28} className="mx-auto mb-2 text-slate-300" />No promo codes yet.
                  </td></tr>
                ) : promos.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.code}</td>
                    <td className="px-6 py-4">{p.description || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">{p.discountPercentage}%</td>
                    <td className="px-6 py-4 text-[11px]">
                      {p.validFrom ? new Date(p.validFrom).toLocaleDateString() : '—'} → {p.validTo ? new Date(p.validTo).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(p)} className="cursor-pointer">
                        <StatusBadge status={p.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer" title="Delete">
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
            <h3 className="text-base font-bold text-slate-900 font-serif">{editingId ? 'Edit Promotion' : 'New Promotion'}</h3>
            {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Promo Code</label>
                <input required className="input-field py-2 uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <input className="input-field py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Discount %</label>
                <input type="number" min="1" max="100" required className="input-field py-2" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valid From</label>
                  <input type="date" className="input-field py-2" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valid To</label>
                  <input type="date" className="input-field py-2" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
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

export default AdminPromotions;
