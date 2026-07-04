const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getServices,
  getServiceByType,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.Controller');

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/type/:type', getServiceByType);

// Admin routes
router.post('/', auth, createService);
router.put('/:type', auth, upload, updateService); // upload middleware for image
router.delete('/:type', auth, deleteService);

module.exports = router;