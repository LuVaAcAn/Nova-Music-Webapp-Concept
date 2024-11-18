require('dotenv').config(); // Loads environment variables
const express = require('express');
const cors = require('cors');
const app = express();
const roomRoutes = require('./routes/roomRoutes');
const roomUserRoutes = require('./routes/roomUserRouter');
const userRoutes = require('./routes/userRoutes');
const radioRoutes = require('./routes/radioRoutes');
const playbackRoutes = require('./routes/playbackRoutes');
const chatRoutes = require('./routes/chatRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

// CORS and JSON middleware
app.use(cors());
app.use(express.json()); // Ensure this line is present

// Define API routes
app.use('/api/rooms', roomRoutes);
app.use('/api/room_users', roomUserRoutes);
app.use('/api/users', userRoutes);
app.use('/api/radios', radioRoutes);
app.use('/api/playback', playbackRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/memberships', membershipRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});
