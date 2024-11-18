const express = require('express');
const router = express.Router();
const playbackController = require('../controllers/playbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/current_playback', authMiddleware, playbackController.addPlayback);
router.get('/current_playback/room/:room_id', authMiddleware, playbackController.getPlaybackByRoom);
router.get('/current_playback/station/:station_id', authMiddleware, playbackController.getPlaybackByStation);
router.delete('/current_playback/:room_id', authMiddleware, playbackController.deletePlaybackByRoom);
router.delete('/current_playback/station/:station_id', authMiddleware, playbackController.deletePlaybackByStation);

module.exports = router;
