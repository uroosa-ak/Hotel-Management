import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users } from '../../components/common/icons';
import guestService from '../../services/guestService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  cnic: '',
  nationality: '',
  gender: 'male',
  preferences: '',
};

const AdminGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchGuests = async () => {
    try {
      const data = await guestService.getAll();
      setGuests(data);
    } catch (err) {
      console.error('Failed to load guests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (g) => {
    setEditingId(g._id);
    setForm({
      firstName: g.firstName || '',
      lastName: g.lastName || '',
      email: g.email || '',
      contact: g.contact || '',
      cnic: g.cnic || '',
      nationality: g.nationality || '',
      gender: g.gender || 'male',
      preferences: g.preferences || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await guestService.update(editingId, form);
      } else {
        await guestService.create(form);
      }
      setShowModal(false);
      await fetchGuests();
    } catch (err) {
      setError(err.message || 'Failed to save guest');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this guest record?')) return;
    try {
      await guestService.delete(id);
      await fetchGuests();
    } catch (err) {
      console.error('Failed to delete guest', err);
    }
  };

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.firstName?.toLowerCase().includes(q) ||
      g.lastName?.toLowerCase().includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.contact?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest Directory (CRM)"
        subtitle="Search guest profiles, track visit history, and manage preferences & contact details."
        action={
          <button onClick={openCreate} className="btn-accent text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus size={16} />
            <span>Add Guest</span>
          </button>
        }
      />

      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field py-2.5 max-w-md text-sm"
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading guest directory..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Nationality</th>
                  <th className="px-6 py-4">Total Visits</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Users size={28} className="mx-auto mb-2 text-slate-300" />
                      No guest records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {g.firstName} {g.lastName}
                        <span className="block text-[11px] text-slate-400 font-normal">{g.email}</span>
                      </td>
                      <td className="px-6 py-4">{g.contact}</td>
                      <td className="px-6 py-4">{g.nationality || '—'}</td>
                      <td className="px-6 py-4 font-semibold">{g.totalVisits || 0}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={g.status || 'active'} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEdit(g)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(g._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              {editingId ? 'Edit Guest Profile' : 'Add New Guest'}
            </h3>
            {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name</label>
                  <input required className="input-field py-2" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name</label>
                  <input required className="input-field py-2" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input type="email" required className="input-field py-2" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact</label>
                  <input required className="input-field py-2" value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CNIC / ID</label>
                  <input className="input-field py-2" value={form.cnic}
                    onChange={(e) => setForm({ ...form, cnic: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nationality</label>
                  <input className="input-field py-2" value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select className="input-field py-2" value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Preferences / Special Requests</label>
                <textarea rows={2} className="input-field py-2" value={form.preferences}
                  onChange={(e) => setForm({ ...form, preferences: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm">
                  {editingId ? 'Save Changes' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGuests;
