import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from './icons';
import notificationService from '../../services/notificationService';

const NotificationBell = ({ dark = false }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  const fetchItems = async () => {
    try {
      setItems(await notificationService.getAll());
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative p-2 rounded-xl cursor-pointer transition-colors ${
          dark ? 'text-[#d6cbbf] hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
            <span className="text-[10px] text-slate-400">{items.length} total</span>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-400">No notifications yet.</p>
            ) : (
              items.map((n) => (
                <div key={n._id} className={`px-4 py-3 text-xs flex items-start gap-2 ${!n.read ? 'bg-amber-50/60' : ''}`}>
                  <div className="flex-1">
                    <p className="text-slate-700">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 shrink-0 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
