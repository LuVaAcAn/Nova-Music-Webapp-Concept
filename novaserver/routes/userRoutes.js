const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure to import the middleware

router.post('/login', userController.loginUser);
router.post('/', userController.createUser);

router.get('/', authMiddleware, userController.getUsers); // Add middleware here

module.exports = router;
