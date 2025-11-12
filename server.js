const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Room } = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

const theRoom = new Room();

io.on('connection', (socket) => {
  const userId = socket.id;
  theRoom.join(userId);

  socket.emit('canvas', theRoom.ops);
  io.emit('users', theRoom.getUsers());

  socket.on('stroke', (stroke) => {
    theRoom.addOp(stroke, userId);
    io.emit('canvas', theRoom.ops);
  });

  socket.on('undo', () => {
    theRoom.undo();
    io.emit('canvas', theRoom.ops);
  });

  socket.on('redo', () => {
    theRoom.redo();
    io.emit('canvas', theRoom.ops);
  });

  socket.on('disconnect', () => {
    theRoom.leave(userId);
    io.emit('users', theRoom.getUsers());
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
