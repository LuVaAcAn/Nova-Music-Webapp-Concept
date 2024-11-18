const express = require('express');
const router = express.Router();
const roomController = require('../controllers/rooms/roomControllers');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/', authMiddleware, roomController.createRoom);
router.put('/rooms/:room_id/privacy', authMiddleware, roomController.updateRoomPrivacy);
router.delete('/:room_id', authMiddleware, roomController.deleteRoom);
router.get('/:created_by', authMiddleware, roomController.getRoomsByUser);

module.exports = router;
