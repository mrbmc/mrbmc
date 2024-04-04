// Size of canvas. These get updated to fill the whole browser.

let width = 150;
let height = 150;

var numBoids = 8;
var boidSize = 4;
var loops = 10000;
var loop = 0;
// const boidColor = "#29201D";//"#00ccFF";
const DRAW_TRAIL = true;
const tailLength = 10000;
const boidShape = "circle";//options: circle (default), square, triangle, cross

//these variables control the motion
const visualRange = 75; // default 75, really controls how quickly boids coalesce
var minDistance = boidSize * 1.5; // The distance to stay away from other boids; default 20
const avoidFactor = 0.09; // Adjust velocity by this %; default 0.05
const matchingFactor = 0.1; // Adjust by this % of average velocity; default 0.05
var speedLimit = 100; //default 15
const centeringFactor = 0.0005; // default .005



var boids = [];

function setBoidSize () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var diagnal = Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
  boidSize = Math.abs(diagnal/150);
  minDistance = boidSize * 1.1;
}

function setSpeedLimit () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var diagnal = Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
  speedLimit = Math.abs(diagnal/300);
  console.log(speedLimit);
}

function initBoids(_numBoids) {
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
    // ctx.globalAlpha = boid.a;
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
  const canvas = document.getElementById("boids");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // numBoids = (width * height) / 2000;
  // setBoidSize();
  // setSpeedLimit();
  initBoids();
}

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {
  var margin = boidSize * 0;
  var turnFactor = 1;

  if (boid.x < margin) {
    boid.dx += turnFactor;
  }
  if (boid.x > width - margin) {
    boid.dx -= turnFactor
  }
  if (boid.y < margin) {
    boid.dy += turnFactor;
  }
  if (boid.y > height - margin) {
    boid.dy -= turnFactor;
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

    boid.dx += (centerX - boid.x) * centeringFactor;
    boid.dy += (centerY - boid.y) * centeringFactor;
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

    boid.dx += (avgDX - boid.dx) * matchingFactor;
    boid.dy += (avgDY - boid.dy) * matchingFactor;
  }
}

// Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(boid) {
  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

function drawBoid(ctx, boid) {
  const angle = Math.atan2(boid.dy, boid.dx);
  var alpha = "ff";//Math.round(boid.a * 256).toString(16);
  ctx.translate(boid.x, boid.y);
  ctx.rotate(angle);
  ctx.translate(-boid.x, -boid.y);
  ctx.fillStyle = boidColor + alpha;
  ctx.strokeStyle = boidColor;
  ctx.lineWidth = 1;
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
      // ctx.lineTo(boid.x, boid.y);
      break;
    default:
      var radius = boidSize/2; // Arc radius
      var startAngle = 0; // Starting point on circle
      var endAngle = 360;//Math.PI + (Math.PI * j) / 2; // End point on circle
      var counterclockwise = false;// i % 2 !== 0; // clockwise or counterclockwise
      ctx.arc(boid.x, boid.y, radius, startAngle, endAngle, counterclockwise);
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
  // Update each boid
  for (let boid of boids) {
    // Update the velocities according to each rule
    flyTowardsCenter(boid);
    avoidOthers(boid);
    matchVelocity(boid);
    // limitSpeed(boid);
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



  // Schedule the next frame
  if(loop >= loops) return false;
  loop++;
  window.requestAnimationFrame(animationLoop);
}

window.onload = () => {
  // Make sure the canvas always fills the whole window
  window.addEventListener("resize", sizeCanvas, false);
  sizeCanvas();

  // Randomly distribute the boids to start
  initBoids();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};