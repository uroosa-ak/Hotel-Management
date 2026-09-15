const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/PaymentController');
const billingController = require('../Controller/billingController');
const authMiddleware = require('../Middleware/authMiddleware');
const { authorizeRoles } = require('../Middleware/roleMiddleware');

router.use(authMiddleware);

// Standard Payments
router.post('/', authorizeRoles('admin', 'manager', 'receptionist'), paymentController.createPayment);
router.get('/', authorizeRoles('admin', 'manager', 'receptionist'), paymentController.getPayments);
router.patch('/:id/refund', authorizeRoles('admin', 'manager'), paymentController.refundPayment);

// Folio Invoices (Section 6 & 7.2)
router.get('/invoices', authorizeRoles('admin', 'manager', 'receptionist'), billingController.getAllInvoices);
router.get('/invoices/:id', billingController.getInvoice);
router.post('/invoices/:id/add-charge', authorizeRoles('admin', 'manager', 'receptionist'), billingController.addCharge);
router.post('/invoices/:id/settle', authorizeRoles('admin', 'manager', 'receptionist'), billingController.settleInvoice);
router.post('/invoices/:id/send-email', authorizeRoles('admin', 'manager', 'receptionist'), billingController.sendInvoiceEmail);

module.exports = router;
