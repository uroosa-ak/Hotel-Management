import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  CheckCircle,
  Clock,
  Plus,
  AlertTriangle,
  Sparkles,
  Wrench,
  Shield,
  Trash2,
} from '../../components/common/icons';
import roomService from '../../services/roomService';
import maintenanceService from '../../services/maintenanceService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminHousekeeping = () => {
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cleaning'); // 'cleaning' | 'maintenance' | 'all'
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    roomNumber: '',
    issue: '',
    priority: 'medium',
    notes: '',
  });
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchData = async () => {
    try {
      const [roomsData, reqData] = await Promise.all([
        roomService.getAll(),
        maintenanceService.getAll(),
      ]);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setRequests(Array.isArray(reqData) ? reqData : []);
    } catch (err) {
      console.error('Failed to load housekeeping data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    try {
      await roomService.update(roomId, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error('Failed to update room status', err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const targetRoom = rooms.find((r) => String(r.roomNumber) === String(ticketForm.roomNumber));
      await maintenanceService.create({
        room: targetRoom?._id || null,
        issue: ticketForm.issue,
        priority: ticketForm.priority,
        notes: ticketForm.notes,
        status: 'pending',
      });
      if (targetRoom) {
        await roomService.update(targetRoom._id, { status: 'maintenance' });
      }
      setShowNewTicketModal(false);
      setTicketForm({ roomNumber: '', issue: '', priority: 'medium', notes: '' });
      await fetchData();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleAssignToMe = async (ticketId) => {
    try {
      await maintenanceService.assign(ticketId);
      await fetchData();
    } catch (err) {
      console.error('Failed to assign ticket', err);
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      await maintenanceService.resolve(ticketId, resolutionNotes);
      setResolvingId(null);
      setResolutionNotes('');
      await fetchData();
    } catch (err) {
      console.error('Failed to resolve ticket', err);
    }
  };

  const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
  const sortedRequests = [...requests].sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Housekeeping & Maintenance Operations"
        subtitle="Manage suite sanitization cycles, track turnover status, and address maintenance requests."
        action={
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="btn-accent text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Report Maintenance</span>
          </button>
        }
      />

      {/* Roster Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Awaiting Clean</p>
            <h3 className="text-2xl font-bold text-amber-900 mt-1">
              {rooms.filter((r) => r.status === 'cleaning').length} Suites
            </h3>
          </div>
          <Sparkles size={24} className="text-amber-500" />
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Maintenance</p>
            <h3 className="text-2xl font-bold text-rose-900 mt-1">
              {rooms.filter((r) => r.status === 'maintenance').length} Suites
            </h3>
          </div>
          <Wrench size={24} className="text-rose-500" />
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Ready / Clean</p>
            <h3 className="text-2xl font-bold text-emerald-900 mt-1">
              {rooms.filter((r) => r.status === 'available').length} Suites
            </h3>
          </div>
          <CheckCircle size={24} className="text-emerald-500" />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Occupied</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">
              {rooms.filter((r) => r.status === 'occupied').length} Suites
            </h3>
          </div>
          <BedDouble size={24} className="text-blue-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('cleaning')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'cleaning'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Room Sanitization Roster
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'maintenance'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Maintenance Tickets ({requests.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading operational roster..." />
      ) : activeTab === 'cleaning' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Suite / Room</th>
                  <th className="px-6 py-4">Priority Queue</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Housekeeping Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      Room {r.roomNumber}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {r.name || r.roomType} • Floor {r.floor || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === 'cleaning' ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-rose-200">
                          {r.cleaningPriority === 'urgent_vip' ? 'VIP Priority' : 'Check-out Dirty (High)'}
                        </span>
                      ) : r.status === 'occupied' ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-semibold uppercase">
                          Stay-over In-House
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-semibold uppercase">
                          Inspected & Ready
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status || 'available'} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {r.status === 'cleaning' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(r._id, 'available')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          Mark Inspected / Ready
                        </button>
                      )}
                      {r.status === 'available' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(r._id, 'cleaning')}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        >
                          Start Cleaning
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTicketForm((prev) => ({ ...prev, roomNumber: r.roomNumber }));
                          setShowNewTicketModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                        title="Report Damage or Maintenance"
                      >
                        Report Damage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Maintenance Tickets Panel */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Ticket / Issue</th>
                  <th className="px-6 py-4">Suite</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No active maintenance tickets recorded.
                    </td>
                  </tr>
                ) : (
                  sortedRequests.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {t.issue || 'General Maintenance'}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {t.notes || 'Routine repair'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        Room {t.room?.roomNumber || 'Assigned'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                            t.priority === 'emergency'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : t.priority === 'high'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : t.priority === 'low'
                              ? 'bg-slate-50 text-slate-600 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {t.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[11px]">
                        {t.assignedTo?.firstName || t.assignedTo?.username || (
                          <button
                            onClick={() => handleAssignToMe(t._id)}
                            className="text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                          >
                            Assign to me
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={t.status || 'pending'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {t.status === 'completed' ? (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                            <CheckCircle size={14} /> Completed
                          </span>
                        ) : resolvingId === t._id ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <input
                              autoFocus
                              placeholder="Resolution notes..."
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                              className="input-field py-1.5 text-[11px] w-40"
                            />
                            <button
                              onClick={() => handleResolve(t._id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setResolvingId(t._id); setResolutionNotes(''); }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Maintenance Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">Report Maintenance Issue</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101"
                  value={ticketForm.roomNumber}
                  onChange={(e) => setTicketForm({ ...ticketForm, roomNumber: e.target.value })}
                  className="input-field py-2"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling leak, lighting fixture issue"
                  value={ticketForm.issue}
                  onChange={(e) => setTicketForm({ ...ticketForm, issue: e.target.value })}
                  className="input-field py-2"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Priority Level</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="input-field py-2"
                >
                  <option value="low">Low (Cosmetic / Non-urgent)</option>
                  <option value="medium">Medium (Prompt attention needed)</option>
                  <option value="high">High (Impacting guest comfort)</option>
                  <option value="emergency">Emergency (Immediate repair required)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Staff observations..."
                  value={ticketForm.notes}
                  onChange={(e) => setTicketForm({ ...ticketForm, notes: e.target.value })}
                  className="input-field py-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHousekeeping;
