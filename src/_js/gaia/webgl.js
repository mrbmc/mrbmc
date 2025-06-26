const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

const vsSource = `
    attribute vec2 a_position;
    void main(void) {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

const fsSource = `
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

function loadShader(gl, type, source) {
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

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'a_position'),
    },
};

const numBoids = 20;
const positions = new Float32Array(numBoids * 2);
const velocities = new Float32Array(numBoids * 2);
for (let i = 0; i < numBoids; i++) {
    positions[i * 2] = Math.random() * 2 - 1;
    positions[i * 2 + 1] = Math.random() * 2 - 1;
    velocities[i * 2] = Math.random() * 0.02 - 0.01;
    velocities[i * 2 + 1] = Math.random() * 0.02 - 0.01;
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

let maxDistance = 0.1;
let separationWeight = 0.01;
let alignmentWeight = 0.01;
let cohesionWeight = 0.01;
let maxVelocity = 0.5;

const separationSlider = document.getElementById('separation');
const alignmentSlider = document.getElementById('alignment');
const cohesionSlider = document.getElementById('cohesion');
const distanceSlider = document.getElementById('distance');
const velocitySlider = document.getElementById('velocity');

separationSlider.oninput = () => {
    separationWeight = parseFloat(separationSlider.value);
    document.getElementById('separationValue').innerText = separationWeight.toFixed(3);
};

alignmentSlider.oninput = () => {
    alignmentWeight = parseFloat(alignmentSlider.value);
    document.getElementById('alignmentValue').innerText = alignmentWeight.toFixed(3);
};

cohesionSlider.oninput = () => {
    cohesionWeight = parseFloat(cohesionSlider.value);
    document.getElementById('cohesionValue').innerText = cohesionWeight.toFixed(3);
};

distanceSlider.oninput = () => {
    maxDistance = parseFloat(distanceSlider.value);
    document.getElementById('distanceValue').innerText = maxDistance.toFixed(2);
};

velocitySlider.oninput = () => {
    maxVelocity = parseFloat(velocitySlider.value);
    document.getElementById('velocityValue').innerText = maxVelocity.toFixed(2);
};

function updateBoids() {
    for (let i = 0; i < numBoids; i++) {
        let x = positions[i * 2];
        let y = positions[i * 2 + 1];
        let vx = velocities[i * 2];
        let vy = velocities[i * 2 + 1];

        let separationForce = [0, 0];
        let alignmentForce = [0, 0];
        let cohesionForce = [0, 0];
        let count = 0;

        for (let j = 0; j < numBoids; j++) {
            if (i === j) continue;
            let dx = positions[j * 2] - x;
            let dy = positions[j * 2 + 1] - y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                separationForce[0] -= dx / distance;
                separationForce[1] -= dy / distance;

                alignmentForce[0] += velocities[j * 2];
                alignmentForce[1] += velocities[j * 2 + 1];

                cohesionForce[0] += positions[j * 2];
                cohesionForce[1] += positions[j * 2 + 1];

                count++;
            }
        }

        if (count > 0) {
            alignmentForce[0] /= count;
            alignmentForce[1] /= count;
            cohesionForce[0] = (cohesionForce[0] / count - x);
            cohesionForce[1] = (cohesionForce[1] / count - y);
        }

        vx += separationForce[0] * separationWeight + alignmentForce[0] * alignmentWeight + cohesionForce[0] * cohesionWeight;
        vy += separationForce[1] * separationWeight + alignmentForce[1] * alignmentWeight + cohesionForce[1] * cohesionWeight;

        vx = Math.min(vx,maxVelocity);
        vy = Math.min(vy,maxVelocity);

        if (x < -1 || x > 1) vx = -vx;
        if (y < -1 || y > 1) vy = -vy;

        positions[i * 2] += vx;
        positions[i * 2 + 1] += vy;
        velocities[i * 2] = vx;
        velocities[i * 2 + 1] = vy;
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.useProgram(programInfo.program);

    updateBoids();
    gl.drawArrays(gl.POINTS, 0, numBoids);
    requestAnimationFrame(drawScene);
}


function setup() {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    drawScene();
}
setup();