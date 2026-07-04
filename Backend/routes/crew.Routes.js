const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCrew,
  createCrew,
  updateCrew,
  deleteCrew,
} = require('../controllers/crew.Controller');

const router = express.Router();

router.get('/', getCrew);
router.post('/', auth, upload, createCrew);
router.put('/:id', auth, upload, updateCrew);
router.delete('/:id', auth, deleteCrew);

module.exports = router;
