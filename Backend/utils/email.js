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