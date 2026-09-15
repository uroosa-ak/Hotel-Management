import React from 'react';
import { ShieldCheck, Check, XCircle } from '../../components/common/icons';
import PageHeader from '../../components/common/PageHeader';

// Static reference table — the system uses 5 fixed roles with feature-level
// access control (see AdminLayout.jsx nav `allowedRoles`), not a dynamic
// custom-role/permission engine.
const ROLES = ['admin', 'manager', 'receptionist', 'housekeeping', 'guest'];
const ROLE_LABELS = { admin: 'Super Admin', manager: 'Manager', receptionist: 'Receptionist', housekeeping: 'Housekeeping', guest: 'Guest' };

const MODULES = [
  { name: 'Executive Dashboard', roles: ['admin', 'manager', 'receptionist', 'housekeeping'] },
  { name: 'Front Desk / Check-In', roles: ['admin', 'manager', 'receptionist'] },
  { name: 'Room Inventory', roles: ['admin', 'manager', 'receptionist', 'housekeeping'] },
  { name: 'Reservations', roles: ['admin', 'manager', 'receptionist'] },
  { name: 'Housekeeping & Maintenance', roles: ['admin', 'manager', 'receptionist', 'housekeeping'] },
  { name: 'Guest Directory (CRM)', roles: ['admin', 'manager', 'receptionist'] },
  { name: 'Billing & Payments', roles: ['admin', 'manager', 'receptionist'] },
  { name: 'Feedback & Ratings', roles: ['admin', 'manager'] },
  { name: 'Promotions', roles: ['admin', 'manager'] },
  { name: 'Taxes', roles: ['admin', 'manager'] },
  { name: 'Inventory & Supplies', roles: ['admin', 'manager', 'housekeeping'] },
  { name: 'Reports & Analytics', roles: ['admin', 'manager'] },
  { name: 'Staff & Guest Directory', roles: ['admin', 'manager'] },
  { name: 'System Settings', roles: ['admin'] },
  { name: 'Security Center', roles: ['admin'] },
  { name: 'Audit Logs', roles: ['admin'] },
];

const AdminRolesView = () => (
  <div className="space-y-6">
    <PageHeader
      title="Roles & Permissions"
      subtitle="Reference view of which modules each of the 5 system roles can access. Super Admin has unrestricted access."
      badge={<ShieldCheck size={20} className="text-emerald-600" />}
    />

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Module</th>
              {ROLES.map((r) => (
                <th key={r} className="px-4 py-4 text-center">{ROLE_LABELS[r]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MODULES.map((m) => (
              <tr key={m.name} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-semibold text-slate-900">{m.name}</td>
                {ROLES.map((r) => (
                  <td key={r} className="px-4 py-3 text-center">
                    {m.roles.includes(r) ? (
                      <Check size={14} className="text-emerald-600 inline" />
                    ) : (
                      <XCircle size={14} className="text-slate-200 inline" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminRolesView;
