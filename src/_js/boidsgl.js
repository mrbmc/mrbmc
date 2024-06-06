let DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));
Math.clamp = function(val, min, max) {
    return Math.max(Math.min(val, max), min);
}

/* ----------------------------------------
BOIDS DEFINITIONS
---------------------------------------- */
let boids = Array(2000);

class Boid {
    static size = 0.01;
    static _color = "#00DDFF33";

    // These variables control the motion
    static minDistance = Boid.size;
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
        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;
        this.dx = Math.random() * 0.1 - 0.05;
        this.dy = Math.random() * 0.1 - 0.05;
        this.history = [];
    }

    distance(otherBoid) {
        let dx = this.x - otherBoid.x;
        let dy = this.y - otherBoid.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    coalesce() {
        let centerX = 0;
        let centerY = 0;
        let numNeighbors = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if (otherBoid === this) continue;
            if (this.distance(otherBoid) < Boid.range) {
                centerX += otherBoid.x;
                centerY += otherBoid.y;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            centerX /= numNeighbors;
            centerY /= numNeighbors;

            this.dx += (centerX - this.x) * (Boid.cohesion / 500);
            this.dy += (centerY - this.y) * (Boid.cohesion / 500);
        }
    }

    separate() {
        let moveX = 0;
        let moveY = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if (otherBoid === this) continue;
            if (this.distance(otherBoid) < Boid.minDistance) {
                moveX += this.x - otherBoid.x;
                moveY += this.y - otherBoid.y;
            }
        }

        this.dx += moveX * (Boid.separation / 1);
        this.dy += moveY * (Boid.separation / 1);
    }

    align() {
        let avgDX = 0;
        let avgDY = 0;
        let numNeighbors = 0;

        let friends = grid.getFriends(this);
        for (let otherBoid of friends) {
            if (otherBoid === this) continue;
            if (this.distance(otherBoid) < Boid.range) {
                avgDX += otherBoid.dx;
                avgDY += otherBoid.dy;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            avgDX /= numNeighbors;
            avgDY /= numNeighbors;

            this.dx += (avgDX - this.dx) * (Boid.alignment / 5);
            this.dy += (avgDY - this.dy) * (Boid.alignment / 5);
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

    boids = Array.from({ length: boids.length }, () => new Boid());
    updateBuffer();
}

function updateBoids() {
    for (let boid of boids) {
        boid.coalesce();
        boid.separate();
        boid.align();
        boid.limitSpeed();
        boid.keepWithinBounds();
        boid.move();
    }

    grid.storeBoids();
    updateBuffer();
}

function updateBuffer() {
    const _positions = new Float32Array(boids.flatMap(boid => boid.getVertices()));
    gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, _positions, gl.DYNAMIC_DRAW);
}

/* ----------------------------------------
GRID OPTIMIZATION
---------------------------------------- */
class Grid {
    constructor(side) {
        if(DEBUG) console.log('new Grid',this);
        this.cols = side;
        this.rows = side;
        this.cells = Array.from({ length: (side * side) }, () => []);
    }

    getFriends(boid) {
        const cellID = this.getCell(boid);
        return this.cells[cellID];
    }

    storeBoids() {
        this.cells = Array.from({ length: (this.cols * this.rows) }, () => []);
        for (let boid of boids) {
            this.storeBoid(boid);
        }
        return this.cells;
    }

    storeBoid(boid) {
        const cellID = this.getCell(boid);
        this.cells[cellID].push(boid);
    }

    getCell(boid) {
        const px = ((boid.x + 1) / 2) * canvas.width;
        const py = ((boid.y + 1) / 2) * canvas.height;
        const colSize = canvas.width / this.cols;
        const rowSize = canvas.height / this.rows;
        const col = Math.floor(px / colSize);
        const row = Math.floor(py / rowSize);
        const cellID = row * this.cols + col;

        return Math.clamp(cellID, 0, this.cells.length - 1);
    }
}

/* ----------------------------------------
ANIMATION ENGINE
---------------------------------------- */
class Engine {
    static fps = 120;

    constructor() {
        this.framePrev = window.performance.now();
        this.frameTime = Math.floor(1000 / Engine.fps);
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

        gl.drawArrays(gl.TRIANGLES, 0, boids.length * 3);

        requestAnimationFrame(engine.drawFrame);
    }

    drawFrame() {
        requestAnimationFrame(engine.drawFrame);

        updateBoids();

        gl.drawArrays(gl.TRIANGLES, 0, boids.length * 3);

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

        const str = `fps: ${this.avgFPS}\nbds: ${boids.length}\ngrid: ${grid.cells.length}\n`;

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

class Shader {
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

    document.getElementById('reset').addEventListener('click', createBoids);

    document.getElementById('debugger').style.display = (DEBUG) ? "block" : "none";
    document.getElementById('controls').style.display = (DEBUG) ? "block" : "none";
}

function setup() {
    window.grid = new Grid(5);
    window.engine = new Engine();
    window.shader = new Shader();

    initControls();
    createBoids();
    engine.drawFirstFrame();
}

setup();
