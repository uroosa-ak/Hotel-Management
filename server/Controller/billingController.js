const Invoice = require('../models/Invoice');
const Reservation = require('../models/Reservation');
const Booking = require('../models/Booking');
const { notifyUser } = require('../utils/notify');

/**
 * Billing & Folio Controller
 * Strictly conforms to Section 2, 4.4, and 6 of the Master Engineering Blueprint.
 */

// Get Folio / Invoice by Reservation ID or Invoice ID
exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    let invoice = await Invoice.findById(id).populate('guestId reservationId');
    if (!invoice) {
      invoice = await Invoice.findOne({ reservationId: id }).populate('guestId reservationId');
    }
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice / Folio not found.' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add on-demand charge to guest folio (minibar, laundry, room service, spa, etc.)
exports.addCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceType, description, unitPrice, quantity = 1 } = req.body;

    if (!description || unitPrice === undefined) {
      return res.status(400).json({ message: 'Description and unit price are required.' });
    }

    if (Number(unitPrice) < 0) {
      return res.status(400).json({ message: 'Unit price must be a positive number.' });
    }

    let invoice = await Invoice.findById(id);
    if (!invoice) {
      invoice = await Invoice.findOne({ reservationId: id });
    }
    if (!invoice) {
      return res.status(404).json({ message: 'Folio / Invoice not found for this reservation.' });
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const totalPrice = parseFloat((Number(unitPrice) * qty).toFixed(2));

    invoice.lineItems.push({
      description,
      serviceType: serviceType || 'other',
      unitPrice: Number(unitPrice),
      quantity: qty,
      totalPrice,
      recordedBy: req.user?._id || null,
      createdAt: new Date(),
    });

    invoice.recalculateTotals();
    await invoice.save();

    res.json({
      success: true,
      message: 'Charge successfully appended to guest folio.',
      invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Settle Folio Invoice
exports.settleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod = 'cash', amountPaid } = req.body;

    let invoice = await Invoice.findById(id);
    if (!invoice) {
      invoice = await Invoice.findOne({ reservationId: id });
    }
    if (!invoice) {
      return res.status(404).json({ message: 'Folio / Invoice not found.' });
    }

    const paid = amountPaid !== undefined ? Number(amountPaid) : invoice.grandTotal;
    invoice.amountPaid = (invoice.amountPaid || 0) + paid;
    invoice.paymentMethod = paymentMethod;
    invoice.recalculateTotals();
    await invoice.save();

    // Also update matching Booking if exists
    try {
      await Booking.findByIdAndUpdate(invoice.reservationId, {
        paymentStatus: invoice.paymentStatus,
      });
    } catch (bErr) {
      // Ignored if booking alias handles it
    }

    notifyUser(invoice.guestId, `Payment of $${paid.toFixed(2)} received. ${invoice.balanceDue > 0 ? `Remaining balance: $${invoice.balanceDue.toFixed(2)}.` : 'Your invoice is now fully paid.'}`, "info");

    res.json({
      success: true,
      message: 'Invoice successfully settled.',
      invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Invoices (Staff only)
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('guestId reservationId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
