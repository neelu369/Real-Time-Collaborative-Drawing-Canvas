const { DrawingState } = require('./drawing-state');

const COLORS = [
  "#ff4971", "#007fff", "#22cc33", "#ffb300", "#6f47ff", "#595959", "#cc0047"
];

function pickColor(idx) {
  return COLORS[idx % COLORS.length];
}

class Room {
  constructor() {
    this.users = {}; // userId -> {color, name}
    this.drawingState = new DrawingState();
  }
  join(userId) {
    // Assign color, just user id as name for now
    this.users[userId] = { id: userId, color: pickColor(Object.keys(this.users).length)};
  }
  leave(userId) {
    delete this.users[userId];
  }
  getUsers() {
    return Object.values(this.users);
  }
  get ops() {
    return this.drawingState.getOps();
  }
  addOp(op, userId) {
    op.userId = userId;
    this.drawingState.addOp(op);
  }
  undo() {
    this.drawingState.undo();
  }
  redo() {
    this.drawingState.redo();
  }
}

module.exports = { Room };
