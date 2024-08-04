const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const errorHandler = require('./errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
//mongoose.connect('mongodb://localhost/canvasapp', { useNewUrlParser: true, useUnifiedTopology: true });

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('updateCanvas', (data) => {
    io.emit('canvasUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api', apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };