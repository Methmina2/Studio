const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const Crew = require('../models/Crew');
const crewSeedData = require('../data/crewSeedData');
const jwt = require('jsonwebtoken');
const { sendPasswordReset } = require('../utils/email');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    console.log(`🔐 Login attempt for: ${normalizedEmail}`);

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      console.log(`❌ Admin not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log(`❌ Password mismatch for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ Login successful for: ${email}`);
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password/${resetToken}`;
    await sendPasswordReset(admin.email, resetUrl);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createInitialAdmin = async () => {
  try {
    const adminEmail = String(process.env.ADMIN_EMAIL || 'admin@hotmello.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      const admin = new Admin({
        email: adminEmail,
        password: adminPassword,
      });
      await admin.save();
      console.log('✅ Admin created successfully');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (error) {
    console.error('❌ Admin creation error:', error);
  }
};

exports.createInitialCrew = async () => {
  try {
    const count = await Crew.countDocuments();
    if (count === 0) {
      await Crew.insertMany(crewSeedData);
      console.log('✅ Crew seeded successfully');
    } else {
      console.log('ℹ️ Crew members already exist');
    }
  } catch (error) {
    console.error('❌ Crew creation error:', error);
  }
};

// ---------------------------------------------------------------------------
// Admin creation / recovery endpoint (POST /api/auth/create-admin)
//
// This is a break-glass recovery mechanism, not a normal admin-management
// feature — there is deliberately no frontend for it. It only functions when
// ADMIN_CREATION_SECRET is set in the environment; unset it (or never set it
// in a given environment) to fully disable the endpoint. Every attempt is
// logged with IP + timestamp for auditing.
// ---------------------------------------------------------------------------

// Max 3 attempts per IP per 15 minutes.
exports.createAdminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// Optional IP whitelist. If ADMIN_IP_WHITELIST is unset, this check is skipped
// (the secret + rate limiting are still enforced). Set it to a comma-separated
// list of IPs to add an extra layer of restriction.
exports.ipWhitelistMiddleware = (req, res, next) => {
  const whitelist = process.env.ADMIN_IP_WHITELIST;
  if (!whitelist) {
    return next();
  }

  const allowedIps = whitelist.split(',').map((ip) => ip.trim()).filter(Boolean);
  const requestIp = req.ip;

  if (allowedIps.includes(requestIp)) {
    return next();
  }

  console.warn(`🚫 [create-admin] IP not whitelisted: ${requestIp} at ${new Date().toISOString()}`);
  return res.status(403).json({ success: false, message: 'Forbidden' });
};

exports.createAdmin = async (req, res) => {
  const ip = req.ip;
  const timestamp = new Date().toISOString();

  try {
    // The endpoint is fully disabled unless the secret is configured.
    // 404 (rather than 403) so the route's existence isn't revealed when off.
    if (!process.env.ADMIN_CREATION_SECRET) {
      console.warn(`🚫 [create-admin] Endpoint disabled (no ADMIN_CREATION_SECRET set). IP: ${ip} Time: ${timestamp}`);
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const { secret, email, password } = req.body || {};

    if (!secret || typeof secret !== 'string') {
      console.warn(`🚫 [create-admin] Missing secret. IP: ${ip} Time: ${timestamp}`);
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Constant-time comparison. Hashing both values to a fixed-length digest
    // first avoids the length check that crypto.timingSafeEqual requires
    // (buffers of different lengths throw instead of comparing), so the
    // comparison itself stays constant-time regardless of input length.
    const providedHash = crypto.createHash('sha256').update(secret).digest();
    const expectedHash = crypto.createHash('sha256').update(process.env.ADMIN_CREATION_SECRET).digest();
    const secretIsValid = crypto.timingSafeEqual(providedHash, expectedHash);

    if (!secretIsValid) {
      console.warn(`🚫 [create-admin] Invalid secret. IP: ${ip} Time: ${timestamp}`);
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailPattern.test(email)) {
      console.warn(`⚠️ [create-admin] Invalid email provided. IP: ${ip} Time: ${timestamp}`);
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      console.warn(`⚠️ [create-admin] Password too weak. IP: ${ip} Time: ${timestamp}`);
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalizedEmail });
    let action;

    if (admin) {
      admin.password = password; // pre-save hook re-hashes automatically
      await admin.save();
      action = 'updated';
    } else {
      admin = new Admin({ email: normalizedEmail, password });
      await admin.save();
      action = 'created';
    }

    console.log(`✅ [create-admin] SUCCESS - Admin ${action}: ${normalizedEmail}. IP: ${ip} Time: ${timestamp}`);

    return res.status(200).json({
      success: true,
      message: `Admin account ${action} successfully.`,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error(`❌ [create-admin] ERROR - IP: ${ip} Time: ${timestamp}`, error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};