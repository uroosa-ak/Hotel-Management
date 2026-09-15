import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from '../../components/common/icons';
import inventoryService from '../../services/inventoryService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = { itemName: '', quantity: '', category: '', status: 'available' };

const deriveStatus = (qty) => (qty <= 0 ? 'out-of-stock' : qty < 10 ? 'low' : 'available');

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setItems(await inventoryService.getAll());
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quantity = Number(form.quantity);
      await inventoryService.create({ ...form, quantity, status: deriveStatus(quantity) });
      setShowModal(false);
      setForm(emptyForm);
      await fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to save item');
    }
  };

  const adjustQty = async (item, delta) => {
    const quantity = Math.max(0, (item.quantity || 0) + delta);
    try {
      await inventoryService.update(item._id, { quantity, status: deriveStatus(quantity) });
      await fetchItems();
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this inventory item?')) return;
    try {
      await inventoryService.delete(id);
      await fetchItems();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory & Supplies"
        subtitle="Track housekeeping and maintenance stock levels; low-stock items are flagged automatically."
        action={
          <button onClick={() => { setForm(emptyForm); setError(''); setShowModal(true); }} className="btn-accent text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus size={16} /> <span>Add Item</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading inventory..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Package size={28} className="mx-auto mb-2 text-slate-300" />No inventory items recorded.
                  </td></tr>
                ) : items.map((it) => (
                  <tr key={it._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{it.itemName}</td>
                    <td className="px-6 py-4">{it.category || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustQty(it, -1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer">−</button>
                        <span className="font-semibold w-6 text-center">{it.quantity}</span>
                        <button onClick={() => adjustQty(it, 1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(it._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer" title="Delete">
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
            <h3 className="text-base font-bold text-slate-900 font-serif">Add Inventory Item</h3>
            {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Name</label>
                <input required className="input-field py-2" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input placeholder="Linen, Toiletries, Parts..." className="input-field py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity</label>
                  <input type="number" min="0" required className="input-field py-2" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
