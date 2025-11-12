# Architecture

## Data Flow Diagram

User → [Draw/Undo/Redo] → WebSocket → Server → Broadcast → All users

## WebSocket Protocol

- 'stroke': send a stroke (points[], color, tool, width)
- 'undo', 'redo': global
- 'canvas': latest op history
- 'users': current user list

## Undo/Redo

- Server keeps op stack and undone stack (global)
- Undo pops op, redo puts back
- Server state is canonical

## Performance

- Canvas is redrawn from all ops on every change (simple, not optimal, but fast enough)
- All state in memory

## Conflict

- Server is ground truth — late strokes, racing undos are consistent as long as order is preserved

