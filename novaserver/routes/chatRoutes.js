const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/chat', authMiddleware, chatController.addMessage);
router.get('/users', authMiddleware, chatController.getUserDetails);
router.get('/room/:room_id', authMiddleware, chatController.getMessagesByRoom);
router.get('/chat/station/:stat_id', authMiddleware, chatController.getMessagesByStation);

module.exports = router;