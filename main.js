// No import or export statements—everything is global

let opList = [];

// Register the stroke callback, sending strokes to server
registerStrokeCallback(function(stroke) {
  sendStroke(stroke);
});

// Set up callbacks for canvas replay and user list
setCallbacks({
  replay: function(newOps) {
    opList = newOps;
    replayCanvas(opList);
  },
  users: function(users) {
    document.getElementById('users').innerHTML =
      users.map(function(u) {
        return `<span style="color:${u.color}">${u.name || u.id.substring(0,3)}</span>`;
      }).join('');
  }
});

// Undo and redo
document.getElementById('undo').onclick = sendUndo;
document.getElementById('redo').onclick = sendRedo;

// Connect to websocket server
connectWS();
