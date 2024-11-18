const express = require('express');
const router = express.Router();
const radioStationsController = require('../controllers/radioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/radio_stations', authMiddleware, radioStationsController.getAllRadioStations);
router.get('/user/:created_by', authMiddleware, radioStationsController.getRadioStationsByUser);
router.post('/radio_stations', authMiddleware, radioStationsController.createRadioStation);

router.post('/station_users', authMiddleware, radioStationsController.addUserToStation);
router.delete('/station_users/:station_id/:user_id', authMiddleware, radioStationsController.removeUserFromStation);

router.delete('/radio_stations/:station_id', authMiddleware, radioStationsController.deleteRadioStation);

module.exports = router;
