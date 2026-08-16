import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, User, Edit } from '../../components/common/icons';
import userService from '../../services/userService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await userService.updateUser(user._id, { role: newRole });
    await fetchUsers();
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.userId) return;
    await userService.deleteUser(deleteModal.userId);
    setDeleteModal({ isOpen: false, userId: null });
    await fetchUsers();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Guest Directory"
        subtitle="Manage client credentials, administer staff privileges, and view member profiles."
      />

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
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Role Action</th>
                  <th className="px-6 py-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {u.firstName?.[0] || 'U'}
                      </div>
                      <span>
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{u.email}</td>
                    <td className="px-6 py-4">{u.phone || '--'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.role || 'user'} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, userId: u._id })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Delete User Account"
        message="Are you sure you want to permanently remove this user account from the system?"
        confirmText="Yes, Delete User"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
      />
    </div>
  );
};

export default AdminUsers;
