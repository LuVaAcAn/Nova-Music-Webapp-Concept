const express = require('express');
const router = express.Router();
const roomUserController = require('../controllers/rooms/roomUserController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roomUserController.addUserToRoom);
router.delete('/:room_id/:user_id', authMiddleware, roomUserController.removeUserFromRoom);
router.get('/:room_id', authMiddleware, roomUserController.getUsersInRoom);

module.exports = router;
