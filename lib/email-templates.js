export function getReservationEmailTemplate({ name, eventTitle, eventDate, type, seats, phone }) {
  const isTable = type === "table";
  const typeLabel = isTable ? "Paid Table" : "Free Ticket";
  
  const mainAction = isTable
    ? "Please complete your payment via WhatsApp if you haven't already. We'll confirm your reservation once payment is verified."
    : "Please confirm your entry via WhatsApp. Note that free tickets are subject to approval.";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', Courier, monospace; background-color: #000000; color: #F5EDE4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 40px; }
    .logo { font-size: 24px; letter-spacing: 0.2em; color: #FF5401; text-decoration: none; font-weight: bold; }
    .content { line-height: 1.6; font-size: 16px; }
    .details { background-color: #111; padding: 20px; border: 1px solid #333; margin: 30px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #222; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #888; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
    .value { font-weight: bold; }
    .footer { margin-top: 60px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #333; padding-top: 20px; }
    .highlight { color: #FF5401; }
    .btn { display: inline-block; background-color: #FF5401; color: #fff; padding: 15px 30px; text-decoration: none; margin-top: 20px; letter-spacing: 0.1em; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" class="logo">OFFGRID</a>
    </div>
    
    <div class="content">
      <p>Hi ${name},</p>
      <p>Your request for <span class="highlight">${typeLabel}</span> access has been received.</p>
      
      <p>${mainAction}</p>

      <div class="details">
        <div class="detail-row">
          <span class="label">Event</span>
          <span class="value">${eventTitle}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="detail-row">
          <span class="label">Type</span>
          <span class="value">${typeLabel}</span>
        </div>
        ${isTable ? `
        <div class="detail-row">
          <span class="label">Tables Reserved</span>
          <span class="value">${seats}</span>
        </div>` : ''}
        <div class="detail-row">
          <span class="label">Phone</span>
          <span class="value">${phone || 'N/A'}</span>
        </div>
      </div>

      <p>If you have any questions, simply reply to this email or reach out on WhatsApp.</p>
      
      <p>Disconnect to Reconnect.</p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} OffGrid. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
