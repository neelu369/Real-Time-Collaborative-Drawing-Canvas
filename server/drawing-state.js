class DrawingState {
  constructor() {
    this.ops = [];
    this.undone = [];
  }
  addOp(op) {
    this.ops.push(op);
    this.undone = [];
  }
  undo() {
    if (this.ops.length > 0) {
      this.undone.push(this.ops.pop());
    }
  }
  redo() {
    if (this.undone.length > 0) {
      this.ops.push(this.undone.pop());
    }
  }
  getOps() {
    return this.ops;
  }
}
module.exports = { DrawingState };
