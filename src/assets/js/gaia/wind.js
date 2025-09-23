let DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
let VERBOSE = DEBUG && false;

const canvas = document.getElementsByTagName("canvas")[0];
let game = {},
	engine = {},
	gust = {};

Math.clamp = function(val,min,max) {
    return Math.max(Math.min(val,max),min);
}

// t = Time - Amount of time that has passed since the beginning of the animation. Usually starts at 0 and is slowly increased using a game loop or other update function.
// b = Beginning value - The starting point of the animation. Usually it's a static value, you can start at 0 for example.
// c = Change in value - The amount of change needed to go from starting point to end point. It's also usually a static value.
// d = Duration - Amount of time the animation will take. Usually a static value aswell.

function easeInExpo (t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
}
function easeOutQuad (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}
function easeInOutQuad (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
function easeInOutExpo (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}
function easing (t, b, c, d) {
	return easeOutQuad(t, b, c, d);
}

class Engine 
{
	static fps = 120;
	// static timeout = {};

	constructor() {
		if(DEBUG) console.log("new Engine()");
		this.now = window.performance.now();
		this.then = window.performance.now();
		this.timeout = false;
	}

	get delta () {
		return this.now - this.then;
	}

	get interval () {
		return (1000 / Engine.fps);
	}

	animate () {
		// console.log("Engine.animate",engine.delta);

		// FRAME SCHEDULING
		engine.now = window.performance.now();
		window.requestAnimationFrame(engine.animate);
		if (engine.delta < engine.interval) return;


		game.update();


		// FRAME SCHEDULING
		engine.debug(engine.delta);
		engine.then = window.performance.now();
	}

	debug (fps) {
	  var str = "fps: " + Math.round(100000 / fps)/100 + "\n";
	      str +="obj: " + game.particles.length + "\n";
	      // str +="alv: " + (Math.round(GameWorld.aliveCells / GameWorld.numCells * 10000)/100) + "%\n";
	      // str +="chg: " + GameWorld.changesNow;

		document.getElementById("fps").textContent = str;
		document.getElementById("fps").style.display = DEBUG?"block":"none";
	}
}

class Position {
	constructor (x,y) {
		this.x = x;
		this.y = y;
	}
}

class Motion
{
	constructor (startPos,distance,duration) {
		this.startTime = window.performance.now();
		this.duration = duration;
		this.startPos = startPos;
		this.distance = distance;
	}

	get elapsed () {
		return window.performance.now() - this.startTime;
	}

	update () {
		if(VERBOSE) console.log("Particle.Motion.update",this);

		var x = easing(this.elapsed,this.startPos.x,this.distance.x,this.duration);
		var y = easing(this.elapsed,this.startPos.y,this.distance.y,this.duration);

		if(x >= game.ctx.canvas.width) {
			x += (game.ctx.canvas.width - x)*1.5;
		}
		if(y >= game.ctx.canvas.height) {
			y += (game.ctx.canvas.height - y)*1.5;
		}
		if(x<=0) {
			x *= -0.5;
		}
		if(y<=0) {
			y *= -0.5;
		}

		// x = Math.clamp(x,1,game.ctx.canvas.width);
		// y = Math.clamp(y,1,game.ctx.canvas.height);

		return new Position(x,y);
	}

}


/*
30

*/

class Gust 
{
	constructor (_direction) {
		if(DEBUG) console.log("new Gust()");

		if(_direction) {
			var change = Math.round(Math.random() * 180) + 90;
			this.direction = _direction + change;
		} else {
			this.direction = Math.round(Math.random() * 360);
		}
		if(this.direction >= 360) this.direction -= 360;

		var d = 4000;
		this.duration = Math.round(Math.random() * (d*.25)) + (d*.75);

		let diagnal = Math.sqrt(Math.pow(game.ctx.canvas.width,2) + Math.pow(game.ctx.canvas.height,2));
		this.distance = Math.round(Math.random() * (diagnal*.5)) + (diagnal*.25);

		setTimeout(game.newGust,(this.duration * 1.25));
	}
}


class Particle 
{
	static color = "#00FFFF";
	static radius = 1;

	constructor(x,y,ctx) {
		// if(DEBUG) console.log("new Particle",game);

		this.position = new Position(x,y);
		this.ctx = ctx;

		this.motion = new Motion(
				this.position,
				this.distance,
				gust.duration
				);
	}

	get distance() {
		var d = Math.round(Math.random() * (gust.distance/2)) + (gust.distance/2);
		var x = d * Math.cos(gust.direction * Math.PI / 180);
		var y = d * Math.sin(gust.direction * Math.PI / 180);
		return new Position(x,y);
	}

	move () {
		if(VERBOSE) console.log("Particle.move");

		this.position = this.motion.update();

		this.draw();
	}

	draw() {
		this.ctx.fillStyle = Particle.color;
		this.ctx.beginPath();
		this.ctx.arc(this.position.x, this.position.y, Particle.radius, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}

}


class Game
{
	static particleCount = "auto";
	static easing = "easeInOutQuad";

	constructor(ctx) {
		console.log("new Game()");
		this.particles = [];
		this.ctx = ctx;

		this.width = ctx.canvas.width;
		this.height = ctx.canvas.height;

		if(Game.particleCount == "auto") {
			var area = this.width * this.height;
			Game.particleCount = Math.sqrt(area);
		}
	}

	newGust() {
		gust = new Gust(gust.direction);
		game.particles.forEach(element =>{
			element.motion = new Motion (
				element.position,
				element.distance,
				gust.duration
				);
		});
	}



	drawParticles () {
		console.log('Game.drawParticles',game);
		for(var i=0;i < Game.particleCount;i++) {
			var x = Math.round(Math.random() * (this.width * 1));
			var y = Math.round(Math.random() * (this.height * 1));

			this.particles.push(new Particle(x,y,this.ctx));
			this.particles[i].draw();
		}
	}

	update () {
		this.ctx.clearRect(0, 0, this.width, this.height);
		game.particles.forEach(element =>{
			element.move();
		})
	}
}

function resizeCanvas(argument) {
	if(DEBUG) console.log("resizeCanvas");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function initGame () {
	console.log("initGame");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
	game = new Game(ctx);
	engine = new Engine();
	gust = new Gust();

	game.drawParticles();

	setTimeout(function(){
		window.requestAnimationFrame(engine.animate);
	},0);
}

window.onload = () => {
	window.addEventListener("resize", resizeCanvas, false);

	initGame();

	if(!DEBUG) {
		document.getElementById("fps").style.display = "none";
	}
};

window.addEventListener('keydown', function(e){ 
		// console.log("keydown",e.keyCode);
	switch(e.keyCode) {
		case 68://escape
			DEBUG = !DEBUG;
			break;
		default:
	}

})