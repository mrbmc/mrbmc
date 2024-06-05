let DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
Math.clamp = function(val,min,max) {
    return Math.max(Math.min(val,max),min);
}

/* ----------------------------------------
BOIDS DEFINITIONS
---------------------------------------- */
const numBoids = 1000;
let boids = [];

class Boid {
    //these variables control the motion
    static minDistance = 0.02;
    static range = 0.1; // default 75, really controls how quickly boids coalesce
    static separation = 0.25; // Adjust velocity by this %; default 0.05
    static alignment = 0.75; // Adjust by this % of average velocity; default 0.5
    static cohesion = 0.1; // How strong the clusters are, default 0.3
    static _speedLimit = 7; //default 15

    static size = 4;
    static color = "#00CCFF";

    static get speedLimit () {
        var fpsFactor = 120 / engine.avgFPS;
        return Boid._speedLimit / 1000 * fpsFactor;
    }

    constructor(){
        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;
        // this.vx = Math.random() * 0.02 - 0.01;
        // this.vy = Math.random() * 0.02 - 0.01;
        this.dx = Math.random() * .1 - 0.05;
        this.dy = Math.random() * .1 - 0.05;
        this.history = [];
    }
    distance (otherBoid) {
        return Math.sqrt(
            (this.x - otherBoid.x) * (this.x - otherBoid.x) +
            (this.y - otherBoid.y) * (this.y - otherBoid.y)
        );
    }
    flyTowardsCenter() {
        let centerX = 0;
        let centerY = 0;
        let numNeighbors = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if(otherBoid == this) continue;
            if (this.distance(otherBoid) < Boid.range) {
                centerX += otherBoid.x;
                centerY += otherBoid.y;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            centerX = centerX / numNeighbors;
            centerY = centerY / numNeighbors;

            this.dx += (centerX - this.x) * (Boid.cohesion/100);
            this.dy += (centerY - this.y) * (Boid.cohesion/100);
        }
    }
    avoid (otherBoid) {
        let moveX = 0;
        let moveY = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if(otherBoid == this) continue;
            if (this.distance(otherBoid) < Boid.minDistance) {
                moveX += this.x - otherBoid.x;
                moveY += this.y - otherBoid.y;
            }
        }

        this.dx += moveX * (Boid.separation / 10);
        this.dy += moveY * (Boid.separation / 10);
    }
    matchVelocity(boid) {
        let avgDX = 0;
        let avgDY = 0;
        let numNeighbors = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if(otherBoid == this) continue;
            if (this.distance(otherBoid) < Boid.range) {
                avgDX += otherBoid.dx;
                avgDY += otherBoid.dy;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            avgDX = avgDX / numNeighbors;
            avgDY = avgDY / numNeighbors;

            this.dx += (avgDX - this.dx) * (Boid.alignment / 10);
            this.dy += (avgDY - this.dy) * (Boid.alignment / 10);
        }
    }
    limitSpeed() {
        const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (speed > Boid.speedLimit) {
            this.dx = (this.dx / speed) * Boid.speedLimit;
            this.dy = (this.dy / speed) * Boid.speedLimit;
        }
    }
    keepWithinBounds() {
        var margin = 0.01;
        var turnFactor = Boid.size;
        var bounce = Math.random() > .25;

        if (this.x < (-1 + margin) || this.x > (1 - margin)) this.dx *= -1;
        if (this.y < (-1 + margin) || this.y > (1 - margin)) this.dy *= -1;
    }

    move () {
        this.x += this.dx;
        this.y += this.dy;
        this.history.push([this.x, this.y, this.a]);
    }

}

function createBoids () {
    if(DEBUG) console.log('createBoids',arguments);

    boids = Array.from({ length: numBoids }, () => new Boid());

    let _positions = new Float32Array(boids.flatMap(boid => [boid.x, boid.y]));
    gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, _positions, gl.DYNAMIC_DRAW);
}

function updateBoids(){
    // if(DEBUG) console.log('updateBoids',arguments);

    for (let i = 0; i < boids.length; i++) {
        let boid = boids[i];

        boid.flyTowardsCenter();
        boid.avoid();
        boid.matchVelocity();
        boid.limitSpeed();
        boid.keepWithinBounds();

        boid.move();
    }

    grid.storeBoids();

    let _positions = new Float32Array(boids.flatMap(boid => [boid.x, boid.y]));
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, _positions);
}




/* ----------------------------------------
GRID OPTIMIZATION
---------------------------------------- */
class Grid {
    constructor(size) {
        console.log('new Grid',size);
        var side = Math.ceil(Math.sqrt(size));
        this.cols = side;
        this.rows = side;
        this.cells = Array.from({ length: (side * side) }, () => []);
    }
    getFriends (boid) {
        var cellID = this.getCell(boid);
        return this.cells[cellID];
    }
    storeBoids() {
        this.cells = Array.from({ length: (this.cols * this.rows) }, () => []);
        boids.map(boid => { grid.storeBoid(boid) });
        return this.cells;
    }
    storeBoid (boid) {
        var cellID = this.getCell(boid);
        this.cells[cellID].push(boid);
    }
    getCell (boid) {
        var px = ((boid.x + 1) / 2) * canvas.width;
        var py = ((boid.y + 1) / 2) * canvas.height;
        var colSize = canvas.width / this.cols;
        var rowSize = canvas.height / this.rows;
        var col = Math.floor(px / colSize);
        var row = Math.floor(py / rowSize);
        var cellID = row * this.cols + col;

        return Math.clamp(cellID,0,(this.cells.length - 1));
    }
}





/* ----------------------------------------
ANIMATION ENGINE
---------------------------------------- */
class Engine {
    static fps = 120;

    constructor(){
        this.framePrev = window.performance.now();
        this.frameTime = Math.floor(1000 / Engine.fps);
        this.history = Array(10);
        this.avgFPS = 120;
    }

    drawFirstFrame () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
        gl.vertexAttribPointer(
            shader.programInfo.attribLocations.vertexPosition,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(shader.programInfo.attribLocations.vertexPosition);
        gl.useProgram(shader.programInfo.program);

        requestAnimationFrame(engine.drawFrame);
    }

    drawFrame () {
        requestAnimationFrame(engine.drawFrame);

        // var frameNow = window.performance.now();
        // var frameSince = frameNow - engine.framePrev;
        // // if (frameSince <= engine.frameTime) return;

        updateBoids();

        gl.drawArrays(gl.POINTS, 0, numBoids);

        engine.debug();
        engine.framePrev = window.performance.now();
    }

    get fps () {
        var now = window.performance.now();
        var delta = now - this.framePrev;
        var fps = 1000 / delta;
        return Math.round(fps * 10 )/10;
    }

    debug () {
        this.history.push(engine.fps);
        var avgSize = 20;
        this.avgFPS = Math.round(this.history.slice(avgSize * -1).reduce((a, b) => a + b) / avgSize);

        var str = "fps: " + this.avgFPS + "\n";
            str +="bds: " + boids.length + "\n";
            str +="grid: " + grid.cells.length + "\n";

        document.getElementById("debugger").textContent = str;
        document.getElementById("debugger").style.display = DEBUG?"block":"none";
    }
}


/* ----------------------------------------
SETUP THE WEBGL SHADER
---------------------------------------- */

const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

class Shader 
{
    static vsSource = `
        attribute vec2 a_position;
        void main(void) {
            gl_Position = vec4(a_position, 0.0, 1.0);
            gl_PointSize = 3.0;
        }
    `;

    static fsSource = `
        void main(void) {
            gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
        }
    `;

    constructor () {
        if(DEBUG) console.log('new Shader',this);
        this.positionBuffer = gl.createBuffer();
        this.shaderProgram = this.initShaderProgram(gl, Shader.vsSource, Shader.fsSource);
        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.shaderProgram, 'a_position'),
            },
        };
    }

    initShaderProgram(gl, vsSource, fsSource) {
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, Shader.vsSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, Shader.fsSource);

        let _shaderProgram = gl.createProgram();
        gl.attachShader(_shaderProgram, vertexShader);
        gl.attachShader(_shaderProgram, fragmentShader);
        gl.linkProgram(_shaderProgram);

        if (!gl.getProgramParameter(_shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(_shaderProgram));
            return null;
        }
        return _shaderProgram;
    }

    loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }


}


/* ----------------------------------------
CORE APP FUNCTIONS
---------------------------------------- */

function initControls() {
    if(DEBUG) console.log('initControls',arguments);

    window.addEventListener('keydown', function(e){ 
        console.log("keydown",e.keyCode);
        switch(e.keyCode) {
            case 68://D
                DEBUG = !DEBUG;
                break;
            case 67://C
                var el = document.getElementById('controls');
                el.style.display = (el.style.display=="none") ? "block" : "none";
                break;
            default:
        }

    });

    var sliders = ["range","separation","alignment","cohesion"].map(prop => { 
        document.getElementById(prop).addEventListener("input", function (e) {
            Boid[this.id] = parseFloat(this.value);
            document.getElementById(this.id + 'Value').innerText = Boid[this.id].toFixed(2);
        });
        document.getElementById(prop).value = Boid[prop].toFixed(2);
        document.getElementById(prop+'Value').innerText = Boid[prop].toFixed(2);
    });

}

function setup() {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    window.grid = new Grid(5);

    window.engine = new Engine();

    window.shader = new Shader();

    initControls();

    createBoids();

    engine.drawFirstFrame();

}


setup();

