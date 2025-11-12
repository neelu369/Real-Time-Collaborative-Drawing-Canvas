// Handles all WebSocket (Socket.io) comms

let socket = null;

// These are set in main.js
let onReplay = null;
let onUsers = null;

function connectWS() {
  socket = io();

  // On receiving global canvas state
  socket.on('canvas', opList => {
    if (onReplay) onReplay(opList);
  });

  // Users online
  socket.on('users', userList => {
    if (onUsers) onUsers(userList);
  });
}

// Called when local stroke is ready
function sendStroke(stroke) {
  socket.emit('stroke', stroke);
}

function sendUndo() {
  socket.emit('undo');
}

function sendRedo() {
  socket.emit('redo');
}

function setCallbacks({ replay, users }) {
  onReplay = replay;
  onUsers = users;
}
