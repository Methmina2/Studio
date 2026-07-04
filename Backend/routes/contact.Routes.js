const express = require('express');
const auth = require('../middleware/auth');
const {
  createContact,
  getContacts,
} = require('../controllers/contact.Controller');
const router = express.Router();

router.post('/', createContact);
router.get('/', auth, getContacts);

module.exports = router;