// Handles local canvas drawing and replaying strokes from history

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

let drawing = false;
let lastPoint = null;
let myStroke = null;

// Draw a stroke object (used for history replay)
function drawStroke(stroke) {
  ctx.save();
  if (stroke.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = "#ffffff";
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = stroke.color;
  }
  ctx.lineWidth = stroke.width;
  ctx.lineJoin = ctx.lineCap = "round";
  ctx.beginPath();
  // Start at first point
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  // Draw lines between each point (smooth if captured frequently)
  for (const pt of stroke.points.slice(1)) {
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
  ctx.restore();
}

// Redraw the entire canvas from an op list
function replayCanvas(opList) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const stroke of opList) {
    drawStroke(stroke);
  }
}

// Callbacks set by main.js
let onStrokeReady = null;
function registerStrokeCallback(cb) {
  onStrokeReady = cb;
}

// Mouse events for live drawing
function getPos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left,
    y: (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top
  };
}
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('touchstart', startDraw);

function startDraw(evt) {
  drawing = true;
  lastPoint = getPos(evt);
  myStroke = {
    tool: document.getElementById('tool').value,
    color: document.getElementById('color').value,
    width: +document.getElementById('width').value,
    points: [lastPoint]
  };

  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}
canvas.addEventListener('mousemove', moveDraw);
canvas.addEventListener('touchmove', moveDraw);

function moveDraw(evt) {
  if (!drawing) return;
  evt.preventDefault();
  const pt = getPos(evt);
  myStroke.points.push(pt);
  drawStroke({ ...myStroke, points: [lastPoint, pt] });
  lastPoint = pt;
}

canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchend', endDraw);

function endDraw(evt) {
  if (!drawing) return;
  drawing = false;
  if (myStroke && myStroke.points.length > 1 && onStrokeReady) {
    onStrokeReady(myStroke);
  }
  myStroke = null;
}

