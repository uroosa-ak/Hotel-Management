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
    severity: 'Medium',
    notes: '',
  });

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
        severity: ticketForm.severity,
        notes: ticketForm.notes,
        status: 'pending',
      });
      if (targetRoom) {
        await roomService.update(targetRoom._id, { status: 'maintenance' });
      }
      setShowNewTicketModal(false);
      setTicketForm({ roomNumber: '', issue: '', severity: 'Medium', notes: '' });
      await fetchData();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleTicketStatus = async (ticketId, status) => {
    try {
      await maintenanceService.update(ticketId, { status });
      await fetchData();
    } catch (err) {
      console.error('Failed to update ticket status', err);
    }
  };

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
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Floor</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Housekeeping Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <BedDouble size={16} className="text-slate-400" />
                      <span>{r.name || `Room ${r.roomNumber}`}</span>
                      <span className="text-[11px] text-slate-400 font-normal font-mono">
                        (#{r.roomNumber})
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{r.type || r.roomType}</td>
                    <td className="px-6 py-4">Floor {r.floor || 1}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status || 'available'} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {r.status === 'cleaning' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(r._id, 'available')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          Mark Clean & Ready
                        </button>
                      )}
                      {r.status === 'available' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(r._id, 'cleaning')}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        >
                          Send to Cleaning
                        </button>
                      )}
                      {r.status === 'occupied' && (
                        <span className="text-[11px] text-slate-400 font-medium">Guest In-House</span>
                      )}
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
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No active maintenance tickets recorded.
                    </td>
                  </tr>
                ) : (
                  requests.map((t) => (
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
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-semibold rounded-lg text-[10px] uppercase border border-rose-200">
                          {t.severity || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={t.status || 'pending'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {t.status !== 'resolved' ? (
                          <button
                            onClick={() => handleTicketStatus(t._id, 'resolved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                            <CheckCircle size={14} /> Completed
                          </span>
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
                <label className="block text-slate-700 font-semibold mb-1">Severity Level</label>
                <select
                  value={ticketForm.severity}
                  onChange={(e) => setTicketForm({ ...ticketForm, severity: e.target.value })}
                  className="input-field py-2"
                >
                  <option value="Low">Low (Cosmetic / Non-urgent)</option>
                  <option value="Medium">Medium (Prompt attention needed)</option>
                  <option value="High">High (Impacting guest comfort)</option>
                  <option value="Urgent">Urgent (Immediate repair required)</option>
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
