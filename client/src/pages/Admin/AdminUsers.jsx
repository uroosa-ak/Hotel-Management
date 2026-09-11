import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, User, CheckCircle, XCircle } from '../../components/common/icons';
import userService from '../../services/userService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      await fetchUsers();
    } catch (err) {
      console.error('Failed to change role', err);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleStatus(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.userId) return;
    try {
      await userService.deleteUser(deleteModal.userId);
      setDeleteModal({ isOpen: false, userId: null });
      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'all') return true;
    if (filterRole === 'staff') return ['admin', 'manager', 'receptionist', 'housekeeping'].includes(u.role);
    return u.role === filterRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Guest Directory"
        subtitle="Manage user roles, modify staff access levels (Manager, Receptionist, Housekeeping), and activate or deactivate accounts."
      />

      {/* Role filter tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Accounts' },
          { id: 'staff', label: 'All Staff' },
          { id: 'manager', label: 'Managers' },
          { id: 'receptionist', label: 'Receptionists' },
          { id: 'housekeeping', label: 'Housekeeping' },
          { id: 'guest', label: 'Guests' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterRole(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filterRole === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading user directory..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role Access</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No accounts found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                          {u.firstName?.[0] || u.username?.[0] || 'U'}
                        </div>
                        <div>
                          <span>{u.firstName || u.username || 'User'} {u.lastName || ''}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{u.email}</td>
                      <td className="px-6 py-4">{u.phone || u.contact || '--'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role || 'guest'}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1 font-medium focus:ring-1 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="guest">Guest</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="housekeeping">Housekeeping</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                            u.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {u.isActive !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          <span>{u.isActive !== false ? 'Active' : 'Deactivated'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, userId: u._id })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 size={16} />
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

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
      />
    </div>
  );
};

export default AdminUsers;
