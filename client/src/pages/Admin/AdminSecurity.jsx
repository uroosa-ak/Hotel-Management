import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock } from '../../components/common/icons';
import securityService from '../../services/securityService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSecurity = () => {
  const [history, setHistory] = useState([]);
  const [locked, setLocked] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [h, l] = await Promise.all([securityService.getLoginHistory(), securityService.getLockedAccounts()]);
      setHistory(h);
      setLocked(l);
    } catch (err) {
      console.error('Failed to load security data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUnlock = async (id) => {
    try {
      await securityService.unlockAccount(id);
      await fetchAll();
    } catch (err) {
      console.error('Failed to unlock account', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        subtitle="Monitor login activity, failed attempts, and manage account lockouts."
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading security data..." />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock size={14} /> Locked Accounts ({locked.length})
            </p>
            {locked.length === 0 ? (
              <p className="text-xs text-slate-400">No accounts are currently locked.</p>
            ) : (
              <div className="space-y-2">
                {locked.map((u) => (
                  <div key={u._id} className="flex items-center justify-between text-xs bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                    <span className="font-semibold text-slate-800">{u.firstName} {u.lastName} · {u.email}</span>
                    <button onClick={() => handleUnlock(u._id)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer">
                      Unlock Account
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert size={14} /> Recent Login Activity
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Result</th>
                    <th className="px-6 py-3">IP Address</th>
                    <th className="px-6 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No login history recorded yet.</td></tr>
                  ) : history.slice(0, 50).map((h) => (
                    <tr key={h._id}>
                      <td className="px-6 py-3 font-semibold text-slate-900">{h.email}</td>
                      <td className="px-6 py-3"><StatusBadge status={h.success ? 'active' : 'inactive'} /></td>
                      <td className="px-6 py-3 font-mono text-[11px]">{h.ip || '—'}</td>
                      <td className="px-6 py-3">{new Date(h.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSecurity;
