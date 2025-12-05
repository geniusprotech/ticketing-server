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
          .logo-event { width: 100%; margin: 0 auto; }
      
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
                  <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Logo" class="logo-event">
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
        .logo-event { width: 100%; margin: 0 auto; }
    
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
                    <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Logo" class="logo-event">
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
        .logo-event { width: 100%; margin: 0 auto; }
    
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
                    <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Logo" class="logo-event">
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
    `,
    invitedGuest: ({
        eventName,
        name,
        time,
        location,
        seats,
        supports
    }: {
        eventName: string;
        name: string;
        time: string;
        location: string;
        seats: { seatId: string; seatUrl: string }[];
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>You Are Invited – Event Information</title>
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
        .logo-event { width: 100%; margin: 0 auto; }

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
                    <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Logo" class="logo-event">
                    <h1>You’re Officially Invited 🎉</h1>

                    <p>Hello <strong>${name}</strong>,</p>

                    <p>
                        You are invited to attend <strong>${eventName}</strong> as our honorable guest.
                    </p>

                    <p>
                        Here are your event details:
                    </p>

                    <div class="ticket-box">
                        <strong>📍 Location:</strong><br> ${location}<br><br>
                        <strong>⏰ Time:</strong><br> ${time}
                    </div>

                    <p>
                        Below is your seat assignment.  
                        You can click the seat number to see more details.
                    </p>

                    ${seats.map(s => `
                        <div class="ticket-box">
                            <strong>Seat Number:</strong> ${s.seatId}<br>
                            <a class="btn" href="${s.seatUrl}" target="_blank">View Seat Details</a>
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
                    <div>We’re excited to see you at the event! 🎶<br>
                    <strong>Event Committee</strong></div>

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
    vvipGuest: ({
        eventName,
        name,
        date,
        time,
        location,
        seats,
        supports
    }: {
        eventName: string;
        name: string;
        date: string;
        time: string;
        location: string;
        seats: { seatId: string; seatUrl: string }[];
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Invitation - ${eventName}</title>
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
        .logo-event { width: 100%; margin: 0 auto; border-bottom: 1px solid #eee; }

        .content { padding: 32px 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; line-height: 1.6; }

        h1 { margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; }
        h2 { margin: 0 0 20px; font-size: 16px; font-weight: 500; color: #1e3a8a; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
        
        p { margin: 0 0 16px; font-size: 15px; color: #374151; }

        .highlight-box {
            background-color: #f8fafc;
            border-left: 4px solid #1e3a8a;
            padding: 16px;
            margin: 20px 0;
            font-style: italic;
            color: #4b5563;
        }

        .ticket-box {
            background: #f9fafb;
            padding: 18px;
            border-radius: 8px;
            margin-bottom: 16px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
        }

        .btn {
            display: inline-block;
            padding: 12px 20px;
            border-radius: 6px;
            background-color: #1e3a8a;
            color: #ffffff !important;
            font-weight: 600;
            font-size: 14px;
            margin-top: 8px;
            text-align: center;
        }

        .footer { padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
        .socials { margin-top: 16px; }
        .social-icon { display: inline-block; width: 32px; height: 32px; margin: 0 8px; opacity: 0.8; }
        .social-icon:hover { opacity: 1; }

    </style>
    </head>

    <body>
    <div class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">

            <tr>
                <td class="header">
                    <img src="https://assets.genmedik.com/supports/images/white-logo.png" alt="Saint John's School" class="logo">
                </td>
            </tr>

            <tr>
                <td class="content">
                    <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Event Banner" class="logo-event" style="margin-bottom: 24px; border-radius: 4px;">
                    
                    <h1>Year-End Performance 2025</h1>
                    <h2>“${eventName}”</h2>

                    <p>Dear <strong>${name}</strong>,</p>

                    <p>
                        We are pleased to invite you to our 2025 Year-End Performance, presented this year as an Indonesian Cultural Monologue.
                    </p>

                    <div class="highlight-box">
                        The performance follows <strong>Aruna</strong>, a young girl whose imaginative journey invites the audience to reflect on the <strong>7 Core Values</strong> of Saint John’s School, expressed through captivating Nusantara music and traditional dances.
                    </div>

                    <p>
                        We would be honored by your presence, which will serve as meaningful encouragement for our students and the entire school community.
                    </p>

                    <p><strong>Event Details:</strong></p>
                    <div class="ticket-box">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td width="30" valign="top" style="padding-bottom: 12px; font-size: 18px;">🗓</td>
                                <td valign="top" style="padding-bottom: 12px;">
                                    <strong>Date:</strong><br>
                                    ${date}
                                </td>
                            </tr>
                            <tr>
                                <td width="30" valign="top" style="padding-bottom: 12px; font-size: 18px;">⏰</td>
                                <td valign="top" style="padding-bottom: 12px;">
                                    <strong>Time:</strong><br>
                                    ${time}
                                </td>
                            </tr>
                            <tr>
                                <td width="30" valign="top" style="font-size: 18px;">📍</td>
                                <td valign="top">
                                    <strong>Location:</strong><br>
                                    ${location}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p>
                        Please find your seat assignment below. You may click the button to view specific details regarding your seating.
                    </p>

                    ${seats.map(s => `
                        <div class="ticket-box" style="text-align: center;">
                            <div style="margin-bottom: 8px; font-size: 16px;"><strong>Seat Number: ${s.seatId}</strong></div>
                            <a class="btn" href="${s.seatUrl}" target="_blank">View Seat Details</a>
                        </div>
                    `).join('')}

                    <p style="font-size:13px; color:#6b7280; text-align: center;">
                        If you require assistance, please contact us:<br>
                        <a href="mailto:${supports.email}" style="color: #1e3a8a; text-decoration: underline;">${supports.email}</a> | ${supports.phone}
                    </p>
                </td>
            </tr>

            <tr>
                <td class="footer">
                    <p style="font-size:14px; color:#4b5563;">
                        Warm regards,<br>
                        <strong>Year-End Performance Committee 2025</strong><br>
                        Saint John’s School – Green Lake
                    </p>

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
    reminderGuest: ({
        eventName,
        name,
        date,
        time,
        location,
        supports
    }: {
        eventName: string;
        name: string;
        date: string;
        time: string;
        location: string;
        supports: { linkedInUrl: string; instagramUrl: string; email: string; phone: string };
    }) => `
    <!doctype html>
    <html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>PENGUMUMAN PENTING - ${eventName}</title>
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
            .logo-event { width: 100%; margin: 0 auto; border-bottom: 1px solid #eee; }

            .content { padding: 32px 28px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; line-height: 1.6; }

            h1 { margin: 0 0 12px; font-size: 21px; font-weight: 800; color: #b91c1c; text-align: center; text-transform: uppercase; }
            h2 { margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #1e3a8a; text-align: center; }

            p { margin: 0 0 16px; font-size: 15px; color: #374151; }

            .highlight-box {
                background-color: #fff7ed;
                border-left: 4px solid #b91c1c;
                padding: 16px;
                margin: 20px 0;
                font-weight: 600;
                color: #7c2d12;
            }

            .ticket-box {
                background: #f9fafb;
                padding: 18px;
                border-radius: 8px;
                margin-bottom: 16px;
                border: 1px solid #e5e7eb;
                font-size: 15px;
            }

            .btn {
                display: inline-block;
                padding: 12px 20px;
                border-radius: 6px;
                background-color: #1e3a8a;
                color: #ffffff !important;
                font-weight: 600;
                font-size: 14px;
                margin-top: 8px;
                text-align: center;
            }

            .footer { padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
            .socials { margin-top: 16px; }
            .social-icon { display: inline-block; width: 32px; height: 32px; margin: 0 8px; opacity: 0.8; }
            .social-icon:hover { opacity: 1; }
        </style>
    </head>

    <body>
        <div class="wrapper">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">

                <tr>
                    <td class="header">
                        <img src="https://assets.genmedik.com/supports/images/white-logo.png" alt="Saint John's School" class="logo">
                    </td>
                </tr>

                <tr>
                    <td class="content">
                        <img src="https://assets.genmedik.com/supports/images/logo-email-event.jpeg" alt="Event Banner" class="logo-event" style="margin-bottom: 24px; border-radius: 4px;">

                        <h1>PENGUMUMAN PENTING</h1>
                        <h2>${eventName} — Year-End Performance 2025</h2>

                        <p>Kepada Yth. <strong>${name}</strong>,</p>

                        <p>
                            Terima kasih atas antusiasme dan dukungan Bapak/Ibu untuk menyaksikan pertunjukan akhir tahun kami yang akan diselenggarakan pada:
                        </p>

                        <div class="ticket-box">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="30" valign="top" style="padding-bottom: 12px; font-size: 18px;">🗓</td>
                                    <td valign="top" style="padding-bottom: 12px;">
                                        <strong>Date:</strong><br>
                                        ${date}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30" valign="top" style="padding-bottom: 12px; font-size: 18px;">⏰</td>
                                    <td valign="top" style="padding-bottom: 12px;">
                                        <strong>Time:</strong><br>
                                        ${time}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30" valign="top" style="font-size: 18px;">📍</td>
                                    <td valign="top">
                                        <strong>Location:</strong><br>
                                        ${location}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30" valign="top" style="font-size: 18px;">📌</td>
                                    <td valign="top">
                                        <a href="https://g.co/kgs/kthA1cf" target="_blank" style="color:#1e3a8a; text-decoration:underline; font-size:14px; display:inline-block; margin-top:6px;">Google Maps</a>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="highlight-box">
                            Mohon perhatikan beberapa informasi penting berikut demi kelancaran & kenyamanan acara.
                        </div>

                        <p>1. <strong>Parkir & Pengantaran</strong><br>
                        Area parkir dalam sekolah terbatas dan diprioritaskan bagi pemain & penonton yang memiliki tiket. Bila penuh, akan diarahkan ke kantong parkir terdekat (Ruko Crown).</p>

                        <p>2. <strong>Shuttle Bus</strong><br>
                        Disediakan shuttle bus dari kantong parkir menuju area pertunjukan & sebaliknya setelah acara.</p>

                        <p>3. <strong>Alur Keluar Kendaraan</strong><br>
                        Kendaraan akan diarahkan keluar melalui pintu yang telah ditentukan oleh panitia.</p>

                        <p>4. <strong>Kepatuhan terhadap arahan petugas</strong><br>
                        Seluruh tamu wajib mengikuti arahan petugas selama berada di area sekolah.</p>

                        <p>5. <strong>Wajib menunjukkan tiket sebelum memasuki aula</strong><br>
                        Tiket dapat dicek melalui email pembelian atau melalui halaman berikut:<br>
                        <a href="https://tix.geniusprotech.com/auths/login" target="_blank" style="color:#1e3a8a; text-decoration:underline;">https://tix.geniusprotech.com/auths/login</a>
                        </p>

                        <p style="font-size:13px; color:#6b7280; text-align: center;">
                            Bila memerlukan bantuan, silakan menghubungi kami:<br>
                            <a href="mailto:${supports.email}" style="color: #1e3a8a; text-decoration: underline;">${supports.email}</a> | ${supports.phone}
                        </p>
                    </td>
                </tr>

                <tr>
                    <td class="footer">
                        <p style="font-size:14px; color:#4b5563;">
                            Hormat kami,<br>
                            <strong>Panitia Nusantara Berdendang — Year-End Performance 2025</strong><br>
                            Saint John’s School – Green Lake
                        </p>

                        <div class="socials">
                            <a href="${supports.linkedInUrl}" target="_blank">
                                <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-lindkedin.png" alt="LinkedIn">
                            </a>
                            <a href="${supports.instagramUrl}" target="_blank">
                                <img class="social-icon" src="https://assets.genmedik.com/supports/images/social-media-instagram.png" alt="Instagram">
                            </a>
                        </div>

                        <div style="margin-top:14px; font-size:12px;">
                            © ${new Date().getFullYear()} Genius Project Technology. All rights reserved.
                        </div>
                    </td>
                </tr>

            </table>
        </div>
    </body>
    </html>
    `
};
