const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Guest = require('../models/Guest');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Feedback = require('../models/Feedback');
const Service = require('../models/Service');

const dateFilter = (query) => {
  const filter = {};
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  return filter;
};

// Occupancy report: current + historical breakdown by status
exports.getOccupancyReport = async (req, res) => {
  try {
    const rooms = await Room.find();
    const total = rooms.length;
    const byStatus = rooms.reduce((acc, r) => {
      const s = r.currentStatus || r.status || 'available';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const occupied = byStatus.occupied || 0;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    res.json({ total, byStatus, occupancyRate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Revenue report: total revenue + breakdown by payment method
exports.getRevenueReport = async (req, res) => {
  try {
    const filter = dateFilter(req.query);
    const bookings = await Booking.find(filter);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const payments = await Payment.find(filter.createdAt ? { paymentDate: filter.createdAt } : {});
    const byMethod = payments.reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + (p.amount || 0);
      return acc;
    }, {});
    res.json({ totalRevenue, bookingCount: bookings.length, byMethod });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reservation report: breakdown by status
exports.getReservationReport = async (req, res) => {
  try {
    const filter = dateFilter(req.query);
    const bookings = await Booking.find(filter);
    const byStatus = bookings.reduce((acc, b) => {
      acc[b.bookingStatus] = (acc[b.bookingStatus] || 0) + 1;
      return acc;
    }, {});
    res.json({ total: bookings.length, byStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Guest report: total guests, repeat guests, new guests
exports.getGuestReport = async (req, res) => {
  try {
    const guests = await Guest.find();
    const repeatGuests = guests.filter((g) => (g.totalVisits || 0) > 1).length;
    res.json({ total: guests.length, repeatGuests, newGuests: guests.length - repeatGuests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Staff report: counts by role
exports.getStaffReport = async (req, res) => {
  try {
    const staff = await User.find({ role: { $ne: 'guest' } });
    const byRole = staff.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});
    const active = staff.filter((u) => u.isActive !== false).length;
    res.json({ total: staff.length, active, byRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Housekeeping report: rooms by cleaning status
exports.getHousekeepingReport = async (req, res) => {
  try {
    const rooms = await Room.find();
    const cleaning = rooms.filter((r) => (r.currentStatus || r.status) === 'cleaning').length;
    const ready = rooms.filter((r) => (r.currentStatus || r.status) === 'available').length;
    res.json({ totalRooms: rooms.length, cleaning, ready });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Maintenance report: ticket counts by status/priority
exports.getMaintenanceReport = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find();
    const byStatus = requests.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    const byPriority = requests.reduce((acc, r) => {
      const p = r.priority || 'medium';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    res.json({ total: requests.length, byStatus, byPriority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Services report: usage/revenue by category
exports.getServicesReport = async (req, res) => {
  try {
    const services = await Service.find();
    const byCategory = services.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {});
    res.json({ total: services.length, byCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Feedback report: average rating, distribution
exports.getFeedbackReport = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const avgRating = feedbacks.length
      ? parseFloat((feedbacks.reduce((s, f) => s + (f.overallRating || 0), 0) / feedbacks.length).toFixed(2))
      : 0;
    const distribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
      acc[star] = feedbacks.filter((f) => Math.round(f.overallRating) === star).length;
      return acc;
    }, {});
    res.json({ total: feedbacks.length, avgRating, distribution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics: 6-month revenue & booking trend
exports.getTrends = async (req, res) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString('default', { month: 'short' }) });
    }
    const bookings = await Booking.find();
    const trend = months.map(({ year, month, label }) => {
      const inMonth = bookings.filter((b) => {
        const d = new Date(b.createdAt);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      return {
        label,
        bookings: inMonth.length,
        revenue: inMonth.reduce((s, b) => s + (b.totalAmount || 0), 0),
        cancelled: inMonth.filter((b) => b.bookingStatus === 'cancelled').length,
      };
    });
    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics: popular room types & services
exports.getPopularItems = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room');
    const roomTypeCounts = bookings.reduce((acc, b) => {
      const type = b.room?.roomType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const popularRooms = Object.entries(roomTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const services = await Service.find();
    const serviceCounts = services.reduce((acc, s) => {
      acc[s.serviceName] = (acc[s.serviceName] || 0) + 1;
      return acc;
    }, {});
    const popularServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ popularRooms, popularServices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
