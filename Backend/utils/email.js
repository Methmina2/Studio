const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully');
  } catch (error) {
    console.warn('⚠️ Email sending failed:', error.message);
    // Do not throw – just log
  }
};

exports.sendBookingConfirmation = async (booking) => {
  const packageDetails = booking.package || 'Not specified';
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: 'Booking Confirmation - Hotmello Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e; text-align: center;">Thank you for your booking!</h2>
        <p style="text-align: center; font-size: 16px;">Your booking is currently <strong style="color: #ffaa00;">pending</strong>.</p>
        <hr style="border-color: #333;" />
        <h3 style="color: #de660e;">Booking Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Phone:</strong> ${booking.phone || 'Not provided'}</li>
          <li><strong>Service:</strong> ${booking.service}</li>
          <li><strong>Date:</strong> ${new Date(booking.date).toDateString()}</li>
          <li><strong>Package:</strong> ${packageDetails}</li>
          ${booking.message ? `<li><strong>Message:</strong> ${booking.message}</li>` : ''}
        </ul>
        <hr style="border-color: #333;" />
        <p style="font-size: 14px; color: #aaa;">
          <strong>📞 Payment & Confirmation:</strong> Please contact our studio at 
          <a href="tel:+94701770163" style="color: #de660e; text-decoration: none;">+94 70 177 0163</a> 
          to confirm your booking and arrange payment. Our team will guide you through the payment process and finalise your session.
        </p>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
          Hotmello Studio<br />
          No. 38, Uyandana, Sri Lanka, 60000
        </p>
      </div>
    `,
  });
};

exports.sendBookingConfirmed = async (booking) => {
  const packageDetails = booking.package || 'Not specified';
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: '✅ Your booking is confirmed - Hotmello Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e; text-align: center;">✅ Booking Confirmed</h2>
        <p style="text-align: center; font-size: 16px;">Your booking has been <strong style="color: #22c55e;">confirmed</strong>.</p>
        <hr style="border-color: #333;" />
        <h3 style="color: #de660e;">Booking Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Phone:</strong> ${booking.phone || 'Not provided'}</li>
          <li><strong>Service:</strong> ${booking.service}</li>
          <li><strong>Date:</strong> ${new Date(booking.date).toDateString()}</li>
          <li><strong>Package:</strong> ${packageDetails}</li>
          ${booking.message ? `<li><strong>Message:</strong> ${booking.message}</li>` : ''}
        </ul>
        <hr style="border-color: #333;" />
        <p style="font-size: 14px; color: #aaa;">
          <strong>📞 Next Steps:</strong> We look forward to working with you! 
          If you have any questions, please contact us at 
          <a href="tel:+94701770163" style="color: #de660e; text-decoration: none;">+94 70 177 0163</a>.
        </p>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
          Hotmello Studio<br />
          No. 38, Uyandana, Sri Lanka, 60000
        </p>
      </div>
    `,
  });
};

exports.sendRentalConfirmation = async (rental) => {
  const itemsHtml = rental.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #333;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #333; text-align: right;">LKR ${item.pricePerDay.toLocaleString()}</td>
    </tr>
  `).join('');

  const totalPrice = rental.items.reduce((sum, item) => sum + item.pricePerDay, 0);

  await sendEmail({
    from: `"Hotmello Studio" <${process.env.EMAIL_USER}>`,
    to: rental.email,
    subject: `Rental Application Received - ID: ${rental.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #000; color: #fff; border-radius: 12px; border: 1px solid #de660e;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #de660e; margin-bottom: 5px;">Hotmello Studio</h1>
          <p style="color: #888; font-size: 12px; text-transform: uppercase;">Equipment Rental Receipt</p>
        </div>

        <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #aaa;">Tracking Order ID:</p>
          <h2 style="margin: 5px 0; color: #fff; letter-spacing: 2px;">${rental.orderId}</h2>
        </div>

        <p>Hi ${rental.fullName},</p>
        <p>We have received your application. Your request is currently <strong>Pending</strong> until availability is confirmed.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="color: #de660e; font-size: 12px; text-transform: uppercase;">
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #de660e;">Item</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #de660e;">Daily Rate</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 15px 10px; font-weight: bold;">Total Daily Rate</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #de660e; font-size: 18px;">LKR ${totalPrice.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="border-left: 4px solid #de660e; padding-left: 15px; margin: 25px 0;">
          <p style="margin: 5px 0;"><strong>📅 Collection:</strong> ${new Date(rental.collectionDate).toDateString()} at ${rental.collectionTime}</p>
          <p style="margin: 5px 0;"><strong>📅 Return:</strong> ${new Date(rental.returnDate).toDateString()} at ${rental.returnTime}</p>
        </div>

        <h3 style="color: #de660e;">Next Steps & Payment</h3>
        <ul style="padding-left: 20px; color: #ccc; line-height: 1.6;">
          <li>Wait for our team to contact you via <strong>${rental.contactNumber}</strong>.</li>
          <li>Bring your <strong>Original NIC or Passport</strong> for identity verification.</li>
          <li>Payment can be settled via Bank Transfer or Cash at the studio.</li>
        </ul>

        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
          <p style="font-size: 14px; color: #de660e;"><strong>Hotmello Hotline: +94 70 177 0163</strong></p>
          <p style="font-size: 11px; color: #555;">No. 38, Uyandana, Sri Lanka, 60000</p>
        </div>
      </div>
    `,
  });
};

exports.sendBookingCanceled = async (booking) => {
  const packageDetails = booking.package || 'Not specified';
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: '❌ Your booking has been canceled - Hotmello Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e; text-align: center;">❌ Booking Canceled</h2>
        <p style="text-align: center; font-size: 16px;">Your booking has been <strong style="color: #ef4444;">canceled</strong>.</p>
        <hr style="border-color: #333;" />
        <h3 style="color: #de660e;">Booking Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Phone:</strong> ${booking.phone || 'Not provided'}</li>
          <li><strong>Service:</strong> ${booking.service}</li>
          <li><strong>Date:</strong> ${new Date(booking.date).toDateString()}</li>
          <li><strong>Package:</strong> ${packageDetails}</li>
          ${booking.message ? `<li><strong>Message:</strong> ${booking.message}</li>` : ''}
        </ul>
        <hr style="border-color: #333;" />
        <p style="font-size: 14px; color: #aaa;">
          If you have any questions or would like to reschedule, please contact us at 
          <a href="tel:+94701770163" style="color: #de660e; text-decoration: none;">+94 70 177 0163</a>.
        </p>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
          Hotmello Studio<br />
          No. 38, Uyandana, Sri Lanka, 60000
        </p>
      </div>
    `,
  });
};

exports.sendRentalConfirmation = async (rental) => {
  const itemNames = rental.items.map(item => item.name).join(', ');
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: rental.email,
    subject: 'Rental Application Received - Hotmello Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e; text-align: center;">Thank you for your rental application!</h2>
        <p style="text-align: center; font-size: 16px;">Your application is currently <strong style="color: #ffaa00;">pending</strong>.</p>
        <hr style="border-color: #333;" />
        <h3 style="color: #de660e;">Rental Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${rental.fullName}</li>
          <li><strong>Email:</strong> ${rental.email}</li>
          <li><strong>Phone:</strong> ${rental.contactNumber}</li>
          <li><strong>Items:</strong> ${itemNames}</li>
          <li><strong>Collection:</strong> ${new Date(rental.collectionDate).toDateString()} at ${rental.collectionTime}</li>
          <li><strong>Return:</strong> ${new Date(rental.returnDate).toDateString()} at ${rental.returnTime}</li>
        </ul>
        <hr style="border-color: #333;" />
        <p style="font-size: 14px; color: #aaa;">
          We will review your application and contact you shortly. For urgent inquiries, call us at 
          <a href="tel:+94701770163" style="color: #de660e; text-decoration: none;">+94 70 177 0163</a>.
        </p>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
          Hotmello Studio<br />
          No. 38, Uyandana, Sri Lanka, 60000
        </p>
      </div>
    `,
  });
};

exports.sendContactAutoReply = async (contact) => {
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: contact.email,
    subject: 'We received your message - Hotmello Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e; text-align: center;">Thank you for contacting us!</h2>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <hr style="border-color: #333;" />
        <p><strong>Your message:</strong></p>
        <p style="background: #2a2a2a; padding: 15px; border-radius: 6px;">${contact.message}</p>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
          Hotmello Studio<br />
          No. 38, Uyandana, Sri Lanka, 60000
        </p>
      </div>
    `,
  });
};

exports.sendPasswordReset = async (to, resetUrl) => {
  await sendEmail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset your Hotmello admin password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; border-radius: 10px;">
        <h2 style="color: #de660e;">Password Reset Request</h2>
        <p>You requested a password reset for your admin account.</p>
        <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;margin:20px 0;background:#de660e;color:#000;text-decoration:none;border-radius:6px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #777; margin-top: 30px;">
          Hotmello Studio
        </p>
      </div>
    `,
  });
};