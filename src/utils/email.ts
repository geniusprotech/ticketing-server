export const emailTemplates = {
    ticketPurchase: ({
        name,
        eventName,
        seatId,
        bookingUrl,
        payment: { bankName, accountName, accountNumber },
        supports
    }: {
        name: string;
        eventName: string;
        seatId: string;
        bookingUrl: string;
        payment: { bankName: string; accountName: string; accountNumber: string };
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
      <!doctype html>
      <html lang="en">
      <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Thank You for Your Ticket Purchase</title>
      <style>
          img { border: 0; display: block; max-width: 100%; }
          a { color: inherit; text-decoration: none; }
          body { margin: 0; padding: 0; background-color: #f4f6fb; }
          table { border-spacing: 0; }
          td { padding: 0; }
      
          .wrapper { width: 100%; background-color: #f4f6fb; padding-bottom: 40px; }
          .main { background-color: #ffffff; margin: 0 auto; max-width: 640px; border-radius: 8px; overflow: hidden; }
      
          .header { padding: 24px; text-align: center; background: linear-gradient(90deg,#0f172a 0%, #1e3a8a 100%); color: #fff; }
          .logo { width: 140px; margin: 0 auto; }
      
          .content { padding: 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #111827; line-height: 1.5; }
      
          h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; }
          p { margin: 0 0 16px; font-size: 15px; color: #374151; }
      
          .info-box {
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 18px;
              border: 1px solid #e5e7eb;
              font-size: 15px;
          }
      
          .btn-wrap { text-align: center; margin: 18px 0; }
          .btn {
              display: inline-block;
              padding: 12px 20px;
              border-radius: 8px;
              background-color: #0f172a;
              color: #ffffff !important;
              font-weight: 600;
              font-size: 15px;
          }
      
          .footer { padding: 20px 24px; text-align: center; font-size: 13px; color: #9ca3af; }
          .socials { margin-top: 12px; }
          .social-icon { display: inline-block; width: 36px; height: 36px; margin: 0 6px; }
      </style>
      </head>
      
      <body>
      <div class="wrapper">
          <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              
              <tr>
                  <td class="header">
                      <img src="https://assets.genmedik.com/supports/images/white-logo.png" alt="Logo" class="logo">
                  </td>
              </tr>
      
              <tr>
                  <td class="content">
                  <h1 style="text-align: center;">${eventName}</h1>
                  <h1>Thank You for Your Ticket Purchase 🎉</h1>
      
                  <p>Hello <strong>${name}</strong>,</p>
      
                  <p>
                      Your ticket purchase has been received and is currently 
                      <strong>waiting for admin confirmation.</strong><br>
                      You will receive another email once your payment has been verified.
                  </p>
      
                  <!-- Seat info -->
                  <div class="info-box">
                      <strong>Booking Details:</strong><br>
                      Seat ID: <strong>${seatId}</strong>
                  </div>
      
                  <!-- Payment info -->
                  <div class="info-box">
                      <strong>Payment Instructions:</strong><br>
                      Bank: <strong>${bankName}</strong><br>
                      Account Name: <strong>${accountName}</strong><br>
                      Account Number: <strong>${accountNumber}</strong>
                  </div>
      
                  <!-- CTA -->
                  <div class="btn-wrap">
                      <a href="${bookingUrl}" class="btn" target="_blank" rel="noopener">
                          Upload Transfer Slip
                      </a>
                  </div>
      
                  <p style="font-size:13px; color:#6b7280;">
                      If you need assistance or have questions about your booking, you may contact our support team:<br>
                      <!-- Added phone support -->
                      <strong>Email:</strong> <a href="mailto:${supports.email}">${supports.email}</a><br>
                      <strong>Phone:</strong> ${supports.phone}
                  </p>
      
                  </td>
              </tr>
      
              <!-- Footer -->
              <tr>
                  <td class="footer">
      
                      <div>Warm regards,<br><strong>Event Committee</strong></div>
      
                      <div class="socials">
                          <a href="${supports.linkedInUrl}" target="_blank">
                              <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-lindkedin.png" alt="LinkedIn">
                          </a>
      
                          <a href="${supports.instagramUrl}" target="_blank">
                              <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-instagram.png" alt="Instagram">
                          </a>
                      </div>
      
                      <div style="margin-top:14px; font-size:12px;">
                          © ${new Date().getFullYear()} Event Organizer. All rights reserved.<br>
                      </div>
      
                  </td>
              </tr>
      
          </table>
      </div>
      </body>
      </html>
      `,
    paymentConfirmed: ({
        eventName,
        name,
        tickets,
        supports
    }: {
        eventName: string;
        name: string;
        tickets: { seatId: string; ticketUrl: string }[];
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Your Payment Has Been Confirmed</title>
    <style>
        img { border: 0; display: block; max-width: 100%; }
        a { color: inherit; text-decoration: none; }
        body { margin: 0; padding: 0; background-color: #f4f6fb; }
        table { border-spacing: 0; }
        td { padding: 0; }
    
        .wrapper { width: 100%; background-color: #f4f6fb; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; max-width: 640px; border-radius: 8px; overflow: hidden; }
    
        .header { padding: 24px; text-align: center; background: linear-gradient(90deg,#0f172a 0%, #1e3a8a 100%); color: #fff; }
        .logo { width: 140px; margin: 0 auto; }
    
        .content { padding: 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #111827; line-height: 1.5; }
    
        h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; }
        p { margin: 0 0 16px; font-size: 15px; color: #374151; }
    
        .ticket-box {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 14px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
        }
    
        .btn {
            display: inline-block;
            padding: 10px 16px;
            border-radius: 8px;
            background-color: #0f172a;
            color: #ffffff !important;
            font-weight: 600;
            font-size: 14px;
            margin-top: 6px;
        }
    
        .footer { padding: 20px 24px; text-align: center; font-size: 13px; color: #9ca3af; }
        .socials { margin-top: 12px; }
        .social-icon { display: inline-block; width: 36px; height: 36px; margin: 0 6px; }
    </style>
    </head>
    
    <body>
    <div class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    
            <!-- Header -->
            <tr>
                <td class="header">
                    <img src="https://assets.genmedik.com/supports/images/white-logo.png" alt="Logo" class="logo">
                </td>
            </tr>
    
            <!-- Content -->
            <tr>
                <td class="content">
                    <h1 style="text-align: center;">${eventName}</h1>
                    <h1>Your Payment Has Been Verified 🎉</h1>
    
                    <p>Hello <strong>${name}</strong>,</p>
    
                    <p>
                        We’re excited to let you know that your payment has been 
                        <strong>successfully confirmed.</strong>
                    </p>
    
                    <p>
                        Below are your tickets for the event.  
                        Please download or screenshot them for entry.
                    </p>
    
                    <!-- List of Tickets -->
                    ${tickets.map(t => `
                        <div class="ticket-box">
                            <strong>Seat:</strong> ${t.seatId}<br>
                            <a class="btn" href="${t.ticketUrl}" target="_blank">
                                View Ticket
                            </a>
                        </div>
                    `).join('')}
    
                    <p style="font-size:13px; color:#6b7280;">
                        If you need help, feel free to contact us:<br>
                        <strong>Email:</strong> <a href="mailto:${supports.email}">${supports.email}</a><br>
                        <strong>Phone:</strong> ${supports.phone}
                    </p>
    
                </td>
            </tr>
    
            <!-- Footer -->
            <tr>
                <td class="footer">
    
                    <div>Thank you, and enjoy the event! 🎶<br><strong>Event Committee</strong></div>
    
                    <div class="socials">
                        <a href="${supports.linkedInUrl}" target="_blank">
                            <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-lindkedin.png" alt="LinkedIn">
                        </a>
    
                        <a href="${supports.instagramUrl}" target="_blank">
                            <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-instagram.png" alt="Instagram">
                        </a>
                    </div>
    
                    <div style="margin-top:14px; font-size:12px;">
                        © ${new Date().getFullYear()} Genius Project Technology. All rights reserved.<br>
                    </div>
    
                </td>
            </tr>
    
        </table>
    </div>
    </body>
    </html>
    `,
    bookingRejected: ({
        eventName,
        name,
        seats,
        supports
    }: {
        eventName: string;
        name: string;
        seats: string[]; // contoh: ["A10", "A11"]
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Your Booking Has Been Rejected</title>
    <style>
        img { border: 0; display: block; max-width: 100%; }
        a { color: inherit; text-decoration: none; }
        body { margin: 0; padding: 0; background-color: #f4f6fb; }
        table { border-spacing: 0; }
        td { padding: 0; }
    
        .wrapper { width: 100%; background-color: #f4f6fb; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; max-width: 640px; border-radius: 8px; overflow: hidden; }
    
        .header { padding: 24px; text-align: center; background: linear-gradient(90deg,#7f1d1d 0%, #dc2626 100%); color: #fff; }
        .logo { width: 140px; margin: 0 auto; }
    
        .content { padding: 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #111827; line-height: 1.5; }
    
        h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #7f1d1d; }
        p { margin: 0 0 16px; font-size: 15px; color: #374151; }
    
        .seat-box {
            background: #fef2f2;
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 10px;
            border: 1px solid #fecaca;
            font-size: 15px;
            color: #7f1d1d;
            font-weight: 600;
        }
    
        .footer { padding: 20px 24px; text-align: center; font-size: 13px; color: #9ca3af; }
        .socials { margin-top: 12px; }
        .social-icon { display: inline-block; width: 36px; height: 36px; margin: 0 6px; }
    </style>
    </head>
    
    <body>
    <div class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    
            <!-- Header -->
            <tr>
                <td class="header">
                    <img src="https://assets.genmedik.com/supports/images/white-logo.png" alt="Logo" class="logo">
                </td>
            </tr>
    
            <!-- Content -->
            <tr>
                <td class="content">
                    <h1 style="text-align: center;">${eventName}</h1>
                    <h1>Your Booking Has Been Rejected ❌</h1>
    
                    <p>Hello <strong>${name}</strong>,</p>
    
                    <p>
                        Unfortunately, your booking request <strong>could not be processed</strong> and has been rejected.
                        The seats you previously selected have now been <strong>released</strong> and made available again.
                    </p>
    
                    <p>Seats that were released:</p>
    
                    ${seats.map(s => `
                        <div class="seat-box">
                            Seat: ${s}
                        </div>
                    `).join('')}
    
                    <p style="font-size:13px; color:#6b7280;">
                        If you believe this is a mistake or need further assistance, feel free to contact us:<br>
                        <strong>Email:</strong> <a href="mailto:${supports.email}">${supports.email}</a><br>
                        <strong>Phone:</strong> ${supports.phone}
                    </p>
    
                </td>
            </tr>
    
            <!-- Footer -->
            <tr>
                <td class="footer">
    
                    <div>We’re here to help you 📞<br><strong>Event Committee</strong></div>
    
                    <div class="socials">
                        <a href="${supports.linkedInUrl}" target="_blank">
                            <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-lindkedin.png" alt="LinkedIn">
                        </a>
    
                        <a href="${supports.instagramUrl}" target="_blank">
                            <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-instagram.png" alt="Instagram">
                        </a>
                    </div>
    
                    <div style="margin-top:14px; font-size:12px;">
                        © ${new Date().getFullYear()} Genius Project Technology. All rights reserved.<br>
                    </div>
    
                </td>
            </tr>
    
        </table>
    </div>
    </body>
    </html>
    `
};
