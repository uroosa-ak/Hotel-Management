import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BedDouble, X, Check } from '../../components/common/icons';
import roomService from '../../services/roomService';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    type: 'Deluxe',
    pricePerNight: 200,
    capacity: 2,
    size: 35,
    bedType: 'King',
    view: 'Ocean',
    isAvailable: true,
    description: '',
    amenities: 'Wi-Fi, Balcony, Mini Bar, Smart TV',
    images: '/images/rooms/room-01.jpg',
    pricingRules: { weekendMultiplier: 1, seasonalMultiplier: 1, holidayMultiplier: 1, extraGuestFee: 0, extraBedFee: 0 },
  });

  // Delete dialog state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, roomId: null });

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAll();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      roomNumber: '',
      type: 'Deluxe',
      pricePerNight: 250,
      capacity: 2,
      size: 40,
      bedType: 'King',
      view: 'Ocean',
      isAvailable: true,
      description: 'Spacious suite with luxury bedding and amenities.',
      amenities: 'High-speed Wi-Fi, Balcony, Mini Bar, Smart TV, Room Service',
      images: '/images/rooms/room-01.jpg',
      pricingRules: { weekendMultiplier: 1, seasonalMultiplier: 1, holidayMultiplier: 1, extraGuestFee: 0, extraBedFee: 0 },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      roomNumber: room.roomNumber || '',
      type: room.type || 'Deluxe',
      pricePerNight: room.pricePerNight || 200,
      capacity: room.capacity || 2,
      size: room.size || 35,
      bedType: room.bedType || 'King',
      view: room.view || 'Ocean',
      isAvailable: room.isAvailable !== false,
      description: room.description || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      images: Array.isArray(room.images) ? room.images.join(', ') : '',
      pricingRules: {
        weekendMultiplier: room.pricingRules?.weekendMultiplier ?? 1,
        seasonalMultiplier: room.pricingRules?.seasonalMultiplier ?? 1,
        holidayMultiplier: room.pricingRules?.holidayMultiplier ?? 1,
        extraGuestFee: room.pricingRules?.extraGuestFee ?? 0,
        extraBedFee: room.pricingRules?.extraBedFee ?? 0,
      },
    });
    setModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      capacity: Number(formData.capacity),
      size: Number(formData.size),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      pricingRules: {
        weekendMultiplier: Number(formData.pricingRules.weekendMultiplier) || 1,
        seasonalMultiplier: Number(formData.pricingRules.seasonalMultiplier) || 1,
        holidayMultiplier: Number(formData.pricingRules.holidayMultiplier) || 1,
        extraGuestFee: Number(formData.pricingRules.extraGuestFee) || 0,
        extraBedFee: Number(formData.pricingRules.extraBedFee) || 0,
      },
    };

    if (editingRoom) {
      await roomService.update(editingRoom._id, payload);
    } else {
      await roomService.create(payload);
    }

    setModalOpen(false);
    await fetchRooms();
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.roomId) return;
    await roomService.delete(deleteModal.roomId);
    setDeleteModal({ isOpen: false, roomId: null });
    await fetchRooms();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room & Suite Inventory"
        subtitle="Configure suite rates, availability status, capacity, and specifications."
        action={
          <button
            onClick={handleOpenAdd}
            className="btn-accent text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create New Room</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" text="Loading rooms..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Room / Suite</th>
                  <th className="px-6 py-4">Number</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Price / Night</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <img
                        src={room.images?.[0] || '/images/rooms/room-01.jpg'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span>{room.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      #{room.roomNumber}
                    </td>
                    <td className="px-6 py-4">{room.type}</td>
                    <td className="px-6 py-4">{room.capacity} Guests</td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      ${room.pricePerNight}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={room.isAvailable ? 'available' : 'unavailable'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Room"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, roomId: room._id })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Room"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {editingRoom ? 'Edit Room Details' : 'Add New Accommodation'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Room Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tier / Type *</label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price / Night ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Guests *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    className="input-field"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Size (m²)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bed Configuration</label>
                  <input
                    type="text"
                    placeholder="King Bed"
                    className="input-field"
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Scenery / View</label>
                  <input
                    type="text"
                    placeholder="Ocean"
                    className="input-field"
                    value={formData.view}
                    onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-700 mb-2">Dynamic Pricing Rules</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Weekend Multiplier</label>
                    <input type="number" step="0.05" min="1" className="input-field py-1.5 text-xs"
                      value={formData.pricingRules.weekendMultiplier}
                      onChange={(e) => setFormData({ ...formData, pricingRules: { ...formData.pricingRules, weekendMultiplier: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Seasonal Multiplier</label>
                    <input type="number" step="0.05" min="1" className="input-field py-1.5 text-xs"
                      value={formData.pricingRules.seasonalMultiplier}
                      onChange={(e) => setFormData({ ...formData, pricingRules: { ...formData.pricingRules, seasonalMultiplier: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Extra Guest Fee / Night</label>
                    <input type="number" step="1" min="0" className="input-field py-1.5 text-xs"
                      value={formData.pricingRules.extraGuestFee}
                      onChange={(e) => setFormData({ ...formData, pricingRules: { ...formData.pricingRules, extraGuestFee: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Extra Bed Fee / Night</label>
                    <input type="number" step="1" min="0" className="input-field py-1.5 text-xs"
                      value={formData.pricingRules.extraBedFee}
                      onChange={(e) => setFormData({ ...formData, pricingRules: { ...formData.pricingRules, extraBedFee: e.target.value } })} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Image URLs (comma separated)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <label htmlFor="isAvailable" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Room is Available for Reservation
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs font-bold cursor-pointer">
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Delete Room"
        message="Are you sure you want to remove this suite from the hotel inventory? Any active bookings should be reviewed."
        confirmText="Yes, Delete Room"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, roomId: null })}
      />
    </div>
  );
};

export default AdminRooms;
