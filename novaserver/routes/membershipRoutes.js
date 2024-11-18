const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/mb', authMiddleware, membershipController.createMembership);
router.put('/mb/:user_id',authMiddleware, membershipController.updateMembership);

module.exports = router;
