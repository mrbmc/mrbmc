const DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));

// Size of canvas. These get updated to fill the whole browser.
let width = 150;
let height = 150;
let diagnal = Math.sqrt(Math.pow(width,2) + Math.pow(height,2));

var numBoids = 500;// this is overridden by the screen size.
var boidSize = 4;
var minDistance = boidSize * 3;
const boidShape = "circle";//options: circle (default), square, triangle, cross
const boidColor = "#00FFFF";
const DRAW_TRAIL = false;
const tailLength = 250;

//these variables control the motion
const visualRange = (!DRAW_TRAIL) ? 75 : 25; // default 75, really controls how quickly boids coalesce
const avoidFactor = 0.025; // Adjust velocity by this %; default 0.05
const matchingFactor = 75; // Adjust by this % of average velocity; default 50
const centeringFactor = 1; // How strong the clusters are, default 5
var speedLimit = (!DRAW_TRAIL) ? 20 : 100; //default 15

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;

var boids = [];

function setNumBoids () {
  numBoids = Math.round(diagnal / boidSize * 2);
}

function setBoidSize () {
  if(DEBUG) console.log("Boids.setBoidSize",arguments);

  // boidSize = Math.abs(diagnal / 100);
  // boidSize = (width * height) / numBoids;
  // minDistance = boidSize * 1;
  return true;
}

function setSpeedLimit () {
  if(DEBUG) console.log("Boids.setSpeedLimit",arguments);
  // speedLimit = Math.abs(diagnal / 300);
  speedLimit = boidSize;
}

function initBoids(_numBoids) {
  if(DEBUG) console.log("Boids.initBoids",arguments);

  setNumBoids();
  setBoidSize();
  setSpeedLimit();

  boids = [];
  n = (_numBoids != undefined) ? _numBoids : numBoids;
  for (var i = 0; i < n; i += 1) {
    boids[boids.length] = {
      x: Math.random() * width,
      y: Math.random() * height,
      a: (Math.random() * 0.62) + 0.38,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      history: [],
    };
  }


  // Clear the canvas and redraw all the boids in their current positions
  const ctx = document.getElementById("boids").getContext("2d");
        ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    drawBoid(ctx, boid);
  }

}

function distance(boid1, boid2) {
  return Math.sqrt(
    (boid1.x - boid2.x) * (boid1.x - boid2.x) +
      (boid1.y - boid2.y) * (boid1.y - boid2.y),
  );
}

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  if(DEBUG) console.log("Boids.sizeCanvas",arguments);

  const canvas = document.getElementById("boids");
  width = window.innerWidth;
  height = window.innerHeight;
  diagnal = Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
  canvas.width = width;
  canvas.height = height;

  initBoids();
}

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {

  var margin = 0;//boidSize * 0.5;
  var turnFactor = boidSize;
  var bounce = Math.random() > .25;

  if (boid.x < margin) {
    if(bounce) boid.dx *= -1;//boid.dx += turnFactor;
    else boid.x += (width - margin);
  }
  if (boid.x > width - margin) {
    if(bounce) boid.dx *= -1;
    else boid.x -= (width - margin);
  }
  if (boid.y < margin) {
    if(bounce) boid.dy *= -1;
    else boid.y += (height - margin);
  }
  if (boid.y > height - margin) {
    if(bounce) boid.dy -= turnFactor;
    else boid.y -= (height - margin);
  }
}

// Find the center of mass of the other boids and adjust velocity slightly to
// point towards the center of mass.
function flyTowardsCenter(boid) {
  let centerX = 0;
  let centerY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      centerX += otherBoid.x;
      centerY += otherBoid.y;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    centerX = centerX / numNeighbors;
    centerY = centerY / numNeighbors;

    boid.dx += (centerX - boid.x) * (centeringFactor/1000);
    boid.dy += (centerY - boid.y) * (centeringFactor/1000);
  }
}

// Move away from other boids that are too close to avoid colliding
function avoidOthers(boid) {
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boids) {
    if (otherBoid !== boid) {
      if (distance(boid, otherBoid) < minDistance) {
        moveX += boid.x - otherBoid.x;
        moveY += boid.y - otherBoid.y;
      }
    }
  }

  boid.dx += moveX * avoidFactor;
  boid.dy += moveY * avoidFactor;
}

// Find the average velocity (speed and direction) of the other boids and
// adjust velocity slightly to match.
function matchVelocity(boid) {
  let avgDX = 0;
  let avgDY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      avgDX += otherBoid.dx;
      avgDY += otherBoid.dy;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    avgDX = avgDX / numNeighbors;
    avgDY = avgDY / numNeighbors;

    boid.dx += (avgDX - boid.dx) * (matchingFactor / 1000);
    boid.dy += (avgDY - boid.dy) * (matchingFactor / 1000);
  }
}

// Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(boid) {
  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  // console.log('speed',speed)
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

function drawBoid(ctx, boid) {
  const angle = Math.atan2(boid.dy, boid.dx);
  var alpha = (!DRAW_TRAIL) ? Math.round(boid.a * 256).toString(16) : 50;
  ctx.translate(boid.x, boid.y);
  ctx.rotate(angle);
  ctx.translate(-boid.x, -boid.y);
  ctx.fillStyle = boidColor + alpha;
  ctx.strokeStyle = boidColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();

  switch (boidShape) {
    case "triangle":
      ctx.moveTo(boid.x, boid.y);
      ctx.lineTo(boid.x - boidSize*1, boid.y + boidSize/2);
      ctx.lineTo(boid.x - boidSize*1, boid.y + boidSize/-2);
      ctx.lineTo(boid.x, boid.y);
      break;
    case "square":
      ctx.moveTo(boid.x, boid.y);
      ctx.lineTo(boid.x, boid.y + (boidSize/2));
      ctx.lineTo(boid.x + boidSize, boid.y + (boidSize/2));
      ctx.lineTo(boid.x + boidSize, boid.y - (boidSize/2));
      ctx.lineTo(boid.x, boid.y - (boidSize/2));
      ctx.lineTo(boid.x, boid.y);
      break;
    case "cross":
      ctx.moveTo(boid.x, boid.y);
      ctx.lineTo(boid.x + boidSize, boid.y);
      ctx.lineTo(boid.x + boidSize/2, boid.y);
      ctx.lineTo(boid.x + boidSize/2, boid.y + (boidSize/2));
      ctx.lineTo(boid.x + boidSize/2, boid.y - (boidSize/2));
      break;
    // default:
    case "circle":
      var radius = boidSize / 2; // Arc radius
      var startAngle = 0; // Starting point on circle
      var endAngle = 360;//Math.PI + (Math.PI * j) / 2; // End point on circle
      var counterclockwise = false;// i % 2 !== 0; // clockwise or counterclockwise
      ctx.arc(boid.x, boid.y, radius, startAngle, endAngle, counterclockwise);
      break;
  }
  if(boidShape != "cross") {
    ctx.fill();
  } else {
    ctx.stroke();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (DRAW_TRAIL) {
    ctx.strokeStyle = boidColor + alpha;
    ctx.beginPath();
    var x = boid.history[0] + boidSize;
    var y = boid.history[0] + boidSize;
    ctx.moveTo(x, y);
    for (const point of boid.history) {
      ctx.lineTo(point[0], point[1]);
    }
    ctx.stroke();
  }
}

// Main animation loop
function animationLoop() {

  // Schedule the next frame
  // window.requestAnimationFrame(animationLoop);
  setTimeout(animationLoop,msPerFrame);
  const msNow = window.performance.now()
  const msPassed = msNow - msPrev;
  // if (msPassed < msPerFrame) return
  updateStats(1000 / msPassed);
  msPrev = msNow;

  // Update each boid
  for (let boid of boids) {
    // Update the velocities according to each rule
    flyTowardsCenter(boid);
    avoidOthers(boid);
    matchVelocity(boid);
    limitSpeed(boid);
    keepWithinBounds(boid);

    var alpha = ( Math.abs(boid.dx) / speedLimit) * 1.5;
    var scale = Math.round( Math.abs(boid.dx) / speedLimit);
    // console.log('alpha',scale);

    // Update the position based on the current velocity
    boid.x += boid.dx;
    boid.y += boid.dy;
    boid.a = alpha;
    boid.history.push([boid.x, boid.y, boid.a]);
    boid.history = boid.history.slice(tailLength * -1);
  }
  // console.log(boids[0].a);

  // Clear the canvas and redraw all the boids in their current positions
  const ctx = document.getElementById("boids").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let boid of boids) {
    drawBoid(ctx, boid);
  }

}

function updateStats(_fps) {
  var str = "fps: " + Math.round(_fps) + "\n";
      str +="bds: " + numBoids;

  document.getElementById("fps").textContent = str;
}

window.onload = () => {
  // Make sure the canvas always fills the whole window
  window.addEventListener("resize", sizeCanvas, false);

  sizeCanvas();

  // Randomly distribute the boids to start
  // commented out because it's called by sizeCanvas()
  // initBoids();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};