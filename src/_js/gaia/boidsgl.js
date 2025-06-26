let DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
var PLAY = true;
const OPTIMIZATION_TYPE = "grid";//"grid" or "quadTree" or "geoMap"
const BOID_COUNT = 5000;
const BOID_COLOR = "#00DDFF33";

/* ----------------------------------------
BOIDS DEFINITIONS
---------------------------------------- */
let boids = Array(BOID_COUNT);

class Boid 
{
    static size = 0.005;
    static _color = BOID_COLOR;

    // These variables control the motion
    static minDistance = Boid.size * 2;
    static range = 0.2;
    static separation = 0.3;
    static alignment = 0.3;
    static cohesion = 0.7;
    static _speedLimit = 7;

    static get speedLimit() {
        var fpsFactor = 120 / engine.avgFPS;
        return Boid._speedLimit / 1000 * fpsFactor;
    }

    static get glColor() {
        let hex = Boid._color.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
        let a = 1;
        if (hex.length === 8)
            a = parseInt(hex.substring(6, 8), 16) / 255;

        return [r, g, b, a].toString();
    }

    constructor() {
        this.cell = 0;
        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;
        this.dx = Math.random() * 0.1 - 0.05;
        this.dy = Math.random() * 0.1 - 0.05;
        this.history = [];
    }

    distance(otherBoid) {
        var dx = this.x - otherBoid.x;
        var dy = this.y - otherBoid.y;
        return (dx * dx + dy * dy);
    }

    limitSpeed() {
        const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (speed > Boid.speedLimit) {
            this.dx = (this.dx / speed) * Boid.speedLimit;
            this.dy = (this.dy / speed) * Boid.speedLimit;
        }
    }

    keepWithinBounds() {
        const margin = 0.01;
        if (this.x < -1 + margin || this.x > 1 - margin) this.dx *= -1;
        if (this.y < -1 + margin || this.y > 1 - margin) this.dy *= -1;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    getVertices() {
        const angleRad = calculateAngle(this).radians;
        const height = (Math.sqrt(3) / 1) * Boid.size;
        const centerToVertex = height / Math.sqrt(3);

        const vertex1 = [this.x, this.y - centerToVertex];
        const vertex2 = [this.x - (Boid.size / 2), this.y + (height / 2)];
        const vertex3 = [this.x + (Boid.size / 2), this.y + (height / 2)];


        function calculateAngle(boid) {
            const deltaX = (boid.x + boid.dx) - boid.x;
            const deltaY = (boid.y + boid.dy) - boid.y;
            const angleInRadians = Math.atan2(deltaY, deltaX);
            const angleInDegrees = angleInRadians * (180 / Math.PI);

            return {
                radians: angleInRadians + (Math.PI / 2),
                degrees: angleInDegrees + 180
            };
        }

        function rotatePoint(point, angleRad, boid) {
            const translatedX = point[0] - boid.x;
            const translatedY = point[1] - boid.y;

            const rotatedX = translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
            const rotatedY = translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

            return [rotatedX + boid.x, rotatedY + boid.y];
        }

        const rotatedVertex1 = rotatePoint(vertex1, angleRad, this);
        const rotatedVertex2 = rotatePoint(vertex2, angleRad, this);
        const rotatedVertex3 = rotatePoint(vertex3, angleRad, this);

        return [rotatedVertex1, rotatedVertex2, rotatedVertex3].flat();
    }
}

function createBoids () {
    if(DEBUG) console.log('createBoids',arguments);

    boids = Array.from({ length: BOID_COUNT }, () => new Boid());
    updateBuffer();
}

var mostFriends = 0;
let positions = [];

function updateBoids() {
    mostFriends = 0;

    for (let boid of boids) {

        let centerX = 0;
        let centerY = 0;
        let avgDX = 0;
        let avgDY = 0;
        let moveX = 0;
        let moveY = 0;
        let numNeighbors = 0;

        var friends = optimizer.getFriends(boid);

        //for debugging
        mostFriends = Math.max(mostFriends,friends.length);

        for (let otherBoid of friends) {

            if (otherBoid === boid || otherBoid===undefined) continue;

            //if the other boid is out of visual range, we can skip this loop
            //we assume the collision distance is smaller than the visual distance
            if(boid.distance(otherBoid) > (Boid.range * Boid.range)) continue;

            //coalesce
            centerX += otherBoid.x;
            centerY += otherBoid.y;

            //align
            avgDX += otherBoid.dx;
            avgDY += otherBoid.dy;

            numNeighbors += 1;

            //if there's no collision we can skip this separation
            if (boid.distance(otherBoid) > (Boid.minDistance * Boid.minDistance)) continue;

            //separate
            moveX += (boid.x - otherBoid.x);
            moveY += (boid.y - otherBoid.y);

        }

        numNeighbors = Math.max(numNeighbors,1);

        //coalesce
        centerX /= numNeighbors;
        centerY /= numNeighbors;
        boid.dx += (centerX - boid.x) * (Boid.cohesion / 500);
        boid.dy += (centerY - boid.y) * (Boid.cohesion / 500);
        //align
        avgDX /= numNeighbors;
        avgDY /= numNeighbors;
        boid.dx += (avgDX - boid.dx) * (Boid.alignment / 5);
        boid.dy += (avgDY - boid.dy) * (Boid.alignment / 5);

        //separate
        boid.dx += moveX * (Boid.separation / 1);
        boid.dy += moveY * (Boid.separation / 1);

        boid.limitSpeed();
        boid.keepWithinBounds();
        boid.move();
    }

    optimizer.insertBoids();

    updateBuffer();
}

function updateBuffer() {
    positions = new Float32Array(boids.flatMap(boid => boid.getVertices()));
    gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
}

/* ----------------------------------------
GEOMAP OPTIMIZATION
---------------------------------------- */
class GeoMap 
{
    constructor (vals) {
        // this.boids = new Float32Array(vals);
    }

    insertBoids() {
        // this.boids = boids.flatMap(boid => [boid.x,boid.y]);
    }

    getFriends(boid) {
        var x_max = boid.x + Boid.range,
            x_min = boid.x - Boid.range,
            y_max = boid.y + Boid.range,
            y_min = boid.y - Boid.range;

        return boids.filter((friend)=>{
            return (friend.x > x_min && friend.x < x_max && friend.y > y_min && friend.y < y_max);
        });


        for(let i = 0; i < this.boids.length; i += 2) {
            var x = this.boids[i];
            var y = this.boids[i+1];
            if(x > x_min && x < x_max && y > y_min && y < y_max)
                results.push(boids[i]);
        }
        return results;
    }
}

/* ----------------------------------------
QUADTREE OPTIMIZATION
---------------------------------------- */
class QuadTree 
{
    constructor(boundary, capacity) {
        // if(DEBUG) console.log('new QuadTree',this);
        this.boundary = boundary;
        this.capacity = capacity;
        this.boids = [];
        this.divided = false;

        this.insertBoids();
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;

        const nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        const ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        const sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);
        const se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);

        this.divided = true;
    }

    insertBoids() {
        this.clear();
        boids.forEach(boid => this.insert(boid));
    }

    insert(boid) {
        if (!this.boundary.contains(boid)) {
            return false;
        }
        if (this.boids.length < this.capacity) {
            this.boids.push(boid);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northwest.insert(boid)) return true;
            if (this.northeast.insert(boid)) return true;
            if (this.southwest.insert(boid)) return true;
            if (this.southeast.insert(boid)) return true;
        }
    }

    getFriends(boid) {
        return this.query(new Rectangle(boid.x, boid.y, Boid.range, Boid.range));
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let boid of this.boids) {
            if (range.contains(boid)) {
                found.push(boid);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    clear() {
        this.boids = [];
        if (this.divided) {
            this.northwest.clear();
            this.northeast.clear();
            this.southwest.clear();
            this.southeast.clear();
        }
    }
}

class Rectangle 
{
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(boid) {
        return (boid.x >= this.x - this.w &&
            boid.x < this.x + this.w &&
            boid.y >= this.y - this.h &&
            boid.y < this.y + this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}


/* ----------------------------------------
GRID OPTIMIZATION
---------------------------------------- */
class Grid 
{
    constructor(size) {
        if(DEBUG) console.log('new Grid',this);
        this.size = size;
        this.cells = Array.from({ length: (size * size) }, () => []);

        this.insertBoids();
    }

    getFriends(boid) {
        const cellID = this.getCell(boid);
        return this.cells[cellID];//.slice(100);
    }

    insertBoids() {
        this.cells = Array.from({ length: (this.size * this.size) }, () => []);
        boids.forEach(boid => this.insert(boid));
        return this.cells;
    }

    insert(boid) {
        const cellID = this.getCell(boid);
        this.cells[cellID].push(boid);
    }

    getCell(boid) {
        const col = Math.floor(((boid.x + 1) / 2) * this.size);
        const row = Math.floor(((boid.y + 1) / 2) * this.size);
        const cellID = (row * this.size) + col;
        return clamp(cellID, 0, this.cells.length - 1);
    }
}

/* ----------------------------------------
ANIMATION ENGINE
---------------------------------------- */
class Engine 
{
    static fps = 60;

    constructor() {
        this.framePrev = window.performance.now();
        this.fpsInterval = Math.floor(1000 / Engine.fps);
        this.fpsHistory = Array(10).fill(Engine.fps);
        this.avgFPS = Engine.fps;
    }

    drawFirstFrame() {
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

        gl.drawArrays(gl.TRIANGLES, 0, BOID_COUNT * 3);

        requestAnimationFrame(engine.drawFrame);
    }

    drawFrame() {
        if(PLAY!==true) return;

        requestAnimationFrame(engine.drawFrame);

        let now = window.performance.now();
        let elapsed = now - engine.framePrev;
        // if(elapsed < engine.fpsInterval) return;

        updateBoids();
        gl.drawArrays(gl.TRIANGLES, 0, BOID_COUNT * 3);

        engine.debug();
        engine.framePrev = window.performance.now();
    }

    get fps() {
        const now = window.performance.now();
        const delta = now - this.framePrev;
        const fps = 1000 / delta;
        return Math.round(fps * 10) / 10;
    }

    debug() {
        this.fpsHistory.push(this.fps);
        const avgSize = 20;
        while (this.fpsHistory.length > avgSize) {
            this.fpsHistory.shift();
        }
        this.avgFPS = Math.round(this.fpsHistory.reduce((a, b) => a + b) / avgSize);

        let str = `fps: ${this.avgFPS}\n`;
            str += `bds: ${BOID_COUNT}\n`;
            str += `friends: ${mostFriends}\n`;
            str += `optimizer: ${OPTIMIZATION_TYPE}\n`;

        const debugElem = document.getElementById("debugger");
        debugElem.textContent = str;
        debugElem.style.display = DEBUG ? "block" : "none";
    }
}

/* ----------------------------------------
SETUP THE WEBGL SHADER
---------------------------------------- */
const canvas = document.getElementById('glcanvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
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
            gl_FragColor = vec4(${Boid.glColor});
        }
    `;

    constructor() {
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
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
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
clamp = function(val, min, max) {
    return Math.max(Math.min(val, max), min);
}

function initControls() {
    window.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 68: //D
                DEBUG = !DEBUG;
                break;
            case 67: //C
                const controlsElem = document.getElementById('controls');
                controlsElem.style.display = (controlsElem.style.display == "none") ? "block" : "none";
                break;
        }
    });

    ["range", "separation", "alignment", "cohesion"].forEach(prop => {
        const slider = document.getElementById(prop);
        slider.addEventListener("input", function() {
            Boid[this.id] = parseFloat(this.value);
            document.getElementById(this.id + 'Value').innerText = Boid[this.id].toFixed(2);
        });
        slider.value = Boid[prop].toFixed(2);
        document.getElementById(prop + 'Value').innerText = Boid[prop].toFixed(2);
    });

    document.getElementById('pause').addEventListener('click', e => {
        console.log('PAUSE',PLAY);
        PLAY = !PLAY;
        if(PLAY===true) {
            engine.drawFrame();
        }
    });
    document.getElementById('reset').addEventListener('click', createBoids);

    document.getElementById('debugger').style.display = (DEBUG) ? "block" : "none";
    document.getElementById('controls').style.display = (DEBUG) ? "block" : "none";
}

function setup() {

    window.engine = new Engine();
    window.shader = new Shader();
    createBoids();

    if(OPTIMIZATION_TYPE == "grid") {
        window.optimizer = new Grid(2);
    } else if(OPTIMIZATION_TYPE == "quadTree") {
        window.optimizer = new QuadTree(new Rectangle(0, 0, 2, 2), 48);
    } else if(OPTIMIZATION_TYPE == "geoMap") {
        window.optimizer = new GeoMap(BOID_COUNT * 2);
    }


    initControls();
    engine.drawFirstFrame();
}

setup();
