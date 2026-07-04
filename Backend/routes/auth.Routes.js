const express = require('express');
const {
  login,
  forgotPassword,
  resetPassword,
  createAdmin,
  createAdminLimiter,
  ipWhitelistMiddleware,
} = require('../controllers/auth.Controller');
const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/create-admin', createAdminLimiter, ipWhitelistMiddleware, createAdmin);

module.exports = router;