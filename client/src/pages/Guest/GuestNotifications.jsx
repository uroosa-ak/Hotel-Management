import React, { useState, useEffect } from 'react';
import { Bell, Check } from '../../components/common/icons';
import notificationService from '../../services/notificationService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuestNotifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setItems(await notificationService.getAll());
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading notifications..." />;

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container max-w-3xl">
        <PageHeader title="Notifications" subtitle="Booking updates, payment confirmations, and hotel announcements." />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Bell size={28} className="mx-auto mb-2 text-slate-300" />
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((n) => (
                <div key={n._id} className={`px-6 py-4 flex items-start justify-between gap-3 text-sm ${!n.read ? 'bg-amber-50/60' : ''}`}>
                  <div>
                    <p className="text-slate-700">{n.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 shrink-0 cursor-pointer" title="Mark as read">
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestNotifications;
