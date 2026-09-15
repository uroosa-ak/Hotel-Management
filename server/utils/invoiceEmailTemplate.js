/**
 * Generates an executive HTML email template for guest invoices.
 * 
 * @param {Object} invoice - Invoice database document with populated lineItems, guestId, reservationId
 * @param {Object} [guest] - Guest/User document override if missing from invoice
 * @returns {string} Fully styled HTML email string
 */
function generateInvoiceEmailHtml(invoice, guest) {
  const guestName = guest?.name || guest?.firstName
    ? `${guest.firstName || ''} ${guest.lastName || ''}`.trim()
    : invoice.guestId?.name || invoice.guestId?.firstName || 'Valued Guest';

  const guestEmail = guest?.email || invoice.guestId?.email || 'N/A';
  const invoiceId = invoice._id?.toString().toUpperCase() || 'INV-001';
  const invoiceDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const status = (invoice.paymentStatus || 'pending').toUpperCase();
  const statusColor = status === 'PAID' ? '#10B981' : status === 'PARTIAL' ? '#F59E0B' : '#EF4444';
  const statusBg = status === 'PAID' ? '#D1FAE5' : status === 'PARTIAL' ? '#FEF3C7' : '#FEE2E2';

  const subtotal = (invoice.subtotal || invoice.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const taxAmount = (invoice.taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const grandTotal = (invoice.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const amountPaid = (invoice.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const balanceDue = (invoice.balanceDue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const lineItemsHtml = (invoice.lineItems || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 12px 16px; font-size: 14px; color: #1E293B;">${idx + 1}</td>
      <td style="padding: 12px 16px; font-size: 14px; color: #1E293B; font-weight: 500;">
        ${item.description || 'Hotel Service Item'}
      </td>
      <td style="padding: 12px 16px; font-size: 14px; color: #64748B; text-align: center;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px 16px; font-size: 14px; color: #64748B; text-align: right;">
        PKR ${(item.unitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </td>
      <td style="padding: 12px 16px; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right;">
        PKR ${(item.totalPrice || item.unitPrice * (item.quantity || 1) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Folio Invoice - LuxuryStay Hospitality</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 36px 32px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                LuxuryStay
              </h1>
              <p style="margin: 4px 0 0 0; color: #D4AF37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
                Hospitality & Executive Resort
              </p>
            </td>
          </tr>

          <!-- Welcome Wording -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
                Official Folio Statement
              </h2>
              <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Dear <strong>${guestName}</strong>,<br>
                Thank you for choosing LuxuryStay Hospitality. Below is your detailed statement of account. We hope you enjoyed your stay with us!
              </p>
            </td>
          </tr>

          <!-- Meta Data Grid -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="12" style="background-color: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                <tr>
                  <td width="50%" style="font-size: 13px; color: #64748B;">
                    <strong style="color: #334155;">Invoice Number:</strong><br>#${invoiceId}
                  </td>
                  <td width="50%" style="font-size: 13px; color: #64748B;">
                    <strong style="color: #334155;">Statement Date:</strong><br>${invoiceDate}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748B;">
                    <strong style="color: #334155;">Guest Email:</strong><br>${guestEmail}
                  </td>
                  <td style="font-size: 13px; color: #64748B;">
                    <strong style="color: #334155;">Payment Status:</strong><br>
                    <span style="display: inline-block; padding: 4px 12px; background-color: ${statusBg}; color: ${statusColor}; font-weight: 700; font-size: 12px; border-radius: 20px; letter-spacing: 0.5px; margin-top: 4px;">
                      ${status}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items Table -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                  <tr style="background-color: #0F172A; color: #FFFFFF;">
                    <th style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: left; border-top-left-radius: 6px;">#</th>
                    <th style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: left;">Service Description</th>
                    <th style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Qty</th>
                    <th style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Rate</th>
                    <th style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: right; border-top-right-radius: 6px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHtml.length > 0 ? lineItemsHtml : `
                    <tr>
                      <td colspan="5" style="padding: 16px; text-align: center; color: #64748B; font-size: 14px;">
                        Room Accommodation Charge & Amenities
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary Breakdown -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="border-top: 2px solid #E2E8F0; padding-top: 16px;">
                <tr>
                  <td style="font-size: 14px; color: #64748B;">Subtotal:</td>
                  <td style="font-size: 14px; color: #1E293B; font-weight: 600; text-align: right;">PKR ${subtotal}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #64748B;">Taxes & Service Charge:</td>
                  <td style="font-size: 14px; color: #1E293B; font-weight: 600; text-align: right;">PKR ${taxAmount}</td>
                </tr>
                <tr style="border-top: 1px solid #CBD5E1;">
                  <td style="font-size: 16px; color: #0F172A; font-weight: 700; padding-top: 10px;">Grand Total:</td>
                  <td style="font-size: 18px; color: #0F172A; font-weight: 800; text-align: right; padding-top: 10px;">PKR ${grandTotal}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #10B981; font-weight: 600;">Amount Paid:</td>
                  <td style="font-size: 14px; color: #10B981; font-weight: 700; text-align: right;">PKR ${amountPaid}</td>
                </tr>
                <tr style="background-color: #FEF3C7; border-radius: 6px;">
                  <td style="font-size: 15px; color: #92400E; font-weight: 700; padding: 10px 12px;">Balance Due:</td>
                  <td style="font-size: 17px; color: #92400E; font-weight: 800; text-align: right; padding: 10px 12px;">PKR ${balanceDue}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td style="background-color: #0F172A; padding: 24px 32px; text-align: center; color: #94A3B8; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px 0; color: #D4AF37; font-weight: 600; font-size: 13px;">
                LuxuryStay Hospitality Concierge Desk
              </p>
              <p style="margin: 0;">
                Paradise Bay Waterfront, Boulevard Ave 100 &bull; Phone: +1 (800) 555-STAY<br>
                Email: waqaskamboh269@gmail.com
              </p>
              <p style="margin: 12px 0 0 0; color: #64748B; font-size: 11px;">
                This is an official automated transaction invoice statement.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = { generateInvoiceEmailHtml };
