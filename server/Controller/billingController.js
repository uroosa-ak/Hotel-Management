const Invoice = require('../models/Invoice');
const Reservation = require('../models/Reservation');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { notifyUser } = require('../utils/notify');
const { sendEmail } = require('../utils/emailService');
const { generateInvoiceEmailHtml } = require('../utils/invoiceEmailTemplate');

/**
 * Billing & Folio Controller
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

    let invoice = await Invoice.findById(id).populate('guestId reservationId');
    if (!invoice) {
      invoice = await Invoice.findOne({ reservationId: id }).populate('guestId reservationId');
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

    notifyUser(
      invoice.guestId?._id || invoice.guestId,
      `Payment of PKR ${paid.toLocaleString('en-US', { minimumFractionDigits: 2 })} received. ${
        invoice.balanceDue > 0
          ? `Remaining balance: PKR ${invoice.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`
          : 'Your invoice is now fully paid.'
      }`,
      'info'
    );

    // Send invoice email asynchronously
    try {
      let recipientEmail = invoice.guestId?.email;
      if (!recipientEmail && invoice.reservationId?.guestEmail) {
        recipientEmail = invoice.reservationId.guestEmail;
      }
      if (recipientEmail) {
        const html = generateInvoiceEmailHtml(invoice, invoice.guestId);
        sendEmail({
          to: recipientEmail,
          subject: `Invoice #${invoice._id.toString().toUpperCase()} Settled - LuxuryStay Hospitality`,
          html,
        }).catch((err) => console.error('Settlement invoice email dispatch error:', err.message));
      }
    } catch (emailErr) {
      console.error('Error preparing settlement email:', emailErr.message);
    }

    res.json({
      success: true,
      message: 'Invoice successfully settled.',
      invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send Invoice Email to Guest (Manual trigger from Staff Portal)
exports.sendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientEmail: customEmail } = req.body || {};

    let invoice = await Invoice.findById(id).populate('guestId reservationId');
    if (!invoice) {
      invoice = await Invoice.findOne({ reservationId: id }).populate('guestId reservationId');
    }
    if (!invoice) {
      return res.status(404).json({ message: 'Folio / Invoice not found.' });
    }

    let recipientEmail = customEmail || invoice.guestId?.email;
    if (!recipientEmail && invoice.reservationId?.guestEmail) {
      recipientEmail = invoice.reservationId.guestEmail;
    }
    if (!recipientEmail) {
      // Fallback default email provided by user if guest email is missing
      recipientEmail = 'waqaskamboh269@gmail.com';
    }

    const html = generateInvoiceEmailHtml(invoice, invoice.guestId);
    const result = await sendEmail({
      to: recipientEmail,
      subject: `Official Folio Statement #${invoice._id.toString().toUpperCase()} - LuxuryStay Hospitality`,
      html,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to send email to ${recipientEmail}: ${result.error}`,
      });
    }

    res.json({
      success: true,
      message: `Invoice email successfully sent to ${recipientEmail}`,
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
