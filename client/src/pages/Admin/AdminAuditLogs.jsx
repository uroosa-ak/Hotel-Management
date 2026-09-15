import React, { useState, useEffect } from 'react';
import { ClipboardList } from '../../components/common/icons';
import auditLogService from '../../services/auditLogService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    auditLogService.getAll().then(setLogs).catch((err) => console.error('Failed to load audit logs', err)).finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) => l.action?.toLowerCase().includes(search.toLowerCase()) || l.actorName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="System-wide trail of who changed what, and when — bookings, rooms, users, and payments."
      />

      <input
        type="text"
        placeholder="Search by action or staff member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field py-2.5 max-w-md text-sm"
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading audit trail..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <ClipboardList size={28} className="mx-auto mb-2 text-slate-300" />No audit entries recorded yet.
                  </td></tr>
                ) : filtered.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{l.action}</td>
                    <td className="px-6 py-4">{l.actorName || 'System'}</td>
                    <td className="px-6 py-4">{l.entityType} {l.entityId ? `#${String(l.entityId).slice(-6)}` : ''}</td>
                    <td className="px-6 py-4">{l.details || '—'}</td>
                    <td className="px-6 py-4">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
