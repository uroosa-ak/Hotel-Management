import React, { useState, useEffect } from 'react';
import { Settings } from '../../components/common/icons';
import settingsService from '../../services/settingsService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettings = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.get().then(setForm).catch((err) => console.error('Failed to load settings', err)).finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await settingsService.update(form);
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner size="lg" text="Loading system settings..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Configure hotel information, check-in/out times, currency, and booking policies."
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hotel Name</label>
            <input className="input-field py-2 text-sm" value={form.hotelName} onChange={(e) => handleChange('hotelName', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
            <input className="input-field py-2 text-sm" value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
            <input type="email" className="input-field py-2 text-sm" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input className="input-field py-2 text-sm" value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Check-In Time</label>
            <input type="time" className="input-field py-2 text-sm" value={form.checkInTime} onChange={(e) => handleChange('checkInTime', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Check-Out Time</label>
            <input type="time" className="input-field py-2 text-sm" value={form.checkOutTime} onChange={(e) => handleChange('checkOutTime', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
          <input className="input-field py-2 text-sm" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cancellation Policy</label>
          <textarea rows={2} className="input-field py-2 text-sm" value={form.cancellationPolicy} onChange={(e) => handleChange('cancellationPolicy', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Policy</label>
          <textarea rows={2} className="input-field py-2 text-sm" value={form.bookingPolicy} onChange={(e) => handleChange('bookingPolicy', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Footer Note</label>
          <input className="input-field py-2 text-sm" value={form.invoiceFooterNote} onChange={(e) => handleChange('invoiceFooterNote', e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={form.notificationsEnabled} onChange={(e) => handleChange('notificationsEnabled', e.target.checked)} />
          Enable system notifications
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-accent text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
            <Settings size={14} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-xs text-emerald-600 font-semibold">Saved successfully.</span>}
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
