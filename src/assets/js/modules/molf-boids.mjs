// Boids flocking simulation using WebGL
let numBoids = 4096;

// Math function shortcuts
let {
    PI: PI,
    random: random,
    sqrt: sqrt,
    abs: abs,
    max: max,
    min: min,
    floor: floor,
    cos: cos,
    sin: sin,
    tan: tan
} = Math;

// Create identity matrix
const createIdentityMatrix = () => {
    const matrix = new Float32Array(16);
    matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
    return matrix;
};

// Apply rotation to matrix
const applyRotation = (matrix, rotationX, rotationY) => {
    const cosX = cos(rotationX);
    const sinX = sin(rotationX);
    const cosY = cos(rotationY);
    const sinY = sin(rotationY);
    
    const m0 = matrix[0], m4 = matrix[4], m8 = matrix[8];
    const m1 = matrix[1], m5 = matrix[5], m9 = matrix[9];
    const m2 = matrix[2], m6 = matrix[6], m10 = matrix[10];
    
    matrix[0] = cosX * m0 + sinX * sinY * m1 + sinX * cosY * m2;
    matrix[4] = cosX * m4 + sinX * sinY * m5 + sinX * cosY * m6;
    matrix[8] = cosX * m8 + sinX * sinY * m9 + sinX * cosY * m10;
    
    matrix[1] = cosY * m1 - sinY * m2;
    matrix[5] = cosY * m5 - sinY * m6;
    matrix[9] = cosY * m9 - sinY * m10;
    
    matrix[2] = -sinX * m0 + cosX * sinY * m1 + cosX * cosY * m2;
    matrix[6] = -sinX * m4 + cosX * sinY * m5 + cosX * cosY * m6;
    matrix[10] = -sinX * m8 + cosX * sinY * m9 + cosX * cosY * m10;
};

// Quad vertices for full-screen rendering
const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

// Initialize WebGL context
const initWebGL = (canvas) => {
    const gl = canvas.getContext("webgl");
    if (!gl) throw Error("WebGL not supported");
    
    const vaoExt = getExtension(gl, "OES_vertex_array_object");
    gl.createVertexArray = vaoExt.createVertexArrayOES.bind(vaoExt);
    gl.bindVertexArray = vaoExt.bindVertexArrayOES.bind(vaoExt);
    
    canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
    });
    
    canvas.addEventListener("webglcontextrestored", (event) => {
        event.preventDefault();
        window.location.reload();
    });
    
    return gl;
};

// Create texture (will be properly initialized after WebGL context is created)
const createTexture = (gl, halfFloatExt, data) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 128, 64, 0, gl.RGBA, halfFloatExt.HALF_FLOAT_OES, data);
    return texture;
};

// Float32 to Half-float conversion
const floatBuffer = new Float32Array(1);
const intBuffer = new Int32Array(floatBuffer.buffer);

const floatToHalf = (value) => {
    floatBuffer[0] = value;
    const bits = intBuffer[0];
    const sign = (bits >> 16) & 0x8000;
    let exponent = ((bits & 0x7fffffff) + 0x1000);
    
    if (exponent >= 0x47800000) {
        if ((bits & 0x7fffffff) >= 0x47800000) {
            if (exponent < 0x7f800000) return sign | 0x7c00;
            return sign | 0x7c00 | (bits & 0x007fffff) >> 13;
        }
        return sign | 0x7bff;
    }
    
    if (exponent >= 0x38800000) return sign | exponent - 0x38000000 >> 13;
    if (exponent < 0x33000000) return sign;
    
    exponent = (bits & 0x7fffffff) >> 23;
    return sign | (bits & 0x007fffff | 0x00800000) + (0x00800000 >>> exponent - 102) >> 126 - exponent;
};

// Get WebGL extension
const getExtension = (gl, name) => {
    const ext = gl.getExtension(name);
    if (ext) return ext;
    throw Error(name + " not supported");
};

// Main setup function
const setupScene = (window, options = {}) => {
    const {
        fieldOfView = PI / 17,
        near = 2,
        far = -2,
        lockOrientation = false,
        beta = 0,
        gamma = 0,
        distance = 5,
        square = false,
        customTarget
    } = options;
    
    const canvas = document.createElement('canvas');
    window.document.getElementById('boids').appendChild(canvas);
    const camera = {
        viewMatrix: createIdentityMatrix(),
        projectionMatrix: createIdentityMatrix(),
        aspectRatio: 1,
        pixelRatio: 1,
        minDimension: 1
    };
    
    // applyRotation(camera.projectionMatrix, beta, gamma);
    
    // Handle canvas resizing
    const updateCanvas = () => {
        camera.pixelRatio = window.devicePixelRatio;
        
        if (square) {
            canvas.className = "sq";
        } else {
            camera.aspectRatio = 1;//canvas.clientHeight / canvas.clientWidth;
        }
        console.log('square',square);
        console.log('camera',camera);
        
        canvas.width = camera.pixelRatio * canvas.clientWidth;
        canvas.height = camera.pixelRatio * canvas.clientHeight;
        camera.minDimension = min(canvas.width, canvas.height);
        
        // Update projection matrix
        updateProjectionMatrix(camera.viewMatrix, {
            fieldOfView: fieldOfView,
            aspectRatio: camera.aspectRatio,
            near: near,
            far: far,
            distance: distance
        });
    };
    
    window.addEventListener("resize", updateCanvas);
    updateCanvas();
    
/*
    // Mouse/touch interaction variables
    let mouseX = 0, mouseY = 0;
    let velocityX = 0, velocityY = 0;
    let momentumX = 0, momentumY = 0;
    let isDragging = false;
    
    // Animation loop for smooth camera movement
    const animate = () => {
        let rotX = 7 * (mouseX + momentumX);
        let rotY = 7 * (mouseY + momentumY);
        
        if (customTarget) {
            rotX += customTarget[0];
            rotY += customTarget[1];
        }
        
        if (rotX || rotY) {
            if (lockOrientation) {
                applyRotation(camera.projectionMatrix, rotX, rotY);
            } else {
                // Reset to identity
                camera.projectionMatrix[0] = camera.projectionMatrix[5] = camera.projectionMatrix[10] = 1;
                camera.projectionMatrix[1] = camera.projectionMatrix[2] = camera.projectionMatrix[3] = 0;
                camera.projectionMatrix[4] = camera.projectionMatrix[6] = camera.projectionMatrix[7] = 0;
                camera.projectionMatrix[8] = camera.projectionMatrix[9] = camera.projectionMatrix[11] = 0;
                
                beta += rotX;
                gamma = max(-PI / 25, min(PI / 2.5, gamma + rotY));
                
                applyRotation(camera.projectionMatrix, beta, 0);
                applyRotation(camera.projectionMatrix, 0, gamma);
            }
        }
        
        if (isDragging) {
            velocityX += (mouseX - velocityX) / 3;
            velocityY += (mouseY - velocityY) / 3;
            
            if (abs(velocityX) < 1e-6) velocityX = 0;
            if (abs(velocityY) < 1e-6) velocityY = 0;
            
            mouseY = mouseX = 0;
        }
        
        if (momentumX || momentumY) {
            momentumX /= 1.07;
            momentumY /= 1.07;
            
            if (abs(momentumX) < 1e-6) momentumX = 0;
            if (abs(momentumY) < 1e-6) momentumY = 0;
        }
        
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    
    // Setup mouse/touch controls (commented out in original)
    setupControls(window, 
        (deltaX, deltaY) => {
            isDragging = true;
            deltaX /= camera.minDimension;
            deltaY /= camera.minDimension;
            mouseX += deltaX;
            mouseY += deltaY;
        },
        () => {
            isDragging = false;
            momentumX = velocityX;
            momentumY = velocityY;
            mouseY = velocityY = mouseX = velocityX = 0;
        }
    );
*/
    return {
        gl: initWebGL(canvas),
        camera: camera
    };
};

// Update projection matrix
const updateProjectionMatrix = (matrix, {fieldOfView, aspectRatio = 1, near = 2, far = -2, distance = 5}) => {
    near += distance;
    fieldOfView = (far = max(far + distance, 0.01)) * tan(fieldOfView);
    
    const c = -(near + far) / (near - far);
    
    matrix[0] = 2 * far / (fieldOfView * aspectRatio * 2);
    matrix[5] = 2 * far / (2 * fieldOfView);
    matrix[10] = c;
    matrix[11] = -1;
    matrix[14] = -c * distance + 2 * far * near / (far - near);
    matrix[15] = distance;
};

// Setup mouse/touch controls
/*
const setupControls = (window, onMove, onEnd) => {
    let lastX = 0, lastY = 0;
    const bodyStyle = window.document.body.style;
    bodyStyle.cursor = "grab";
    
    const pointers = [];
    
    const handlePointerEnd = (event) => {
        event.preventDefault();
        for (let i = 0; i < pointers.length; i++) {
            if (pointers[i].pointerId == event.pointerId) {
                pointers.splice(i, 1);
                break;
            }
        }
        if (!pointers.length) {
            bodyStyle.cursor = "grab";
            onEnd();
        }
    };
    
    window.addEventListener("pointerdown", (event) => {
        if (!(event.target instanceof HTMLAnchorElement)) {
            event.preventDefault();
            pointers.push(event);
            bodyStyle.cursor = "grabbing";
            lastX = event.clientX;
            lastY = event.clientY;
        }
    });
    
    window.addEventListener("pointermove", (event) => {
        event.preventDefault();
        if (pointers.length == 1) {
            const deltaX = event.clientX - lastX;
            const deltaY = event.clientY - lastY;
            lastX = event.clientX;
            lastY = event.clientY;
            onMove(deltaX, deltaY);
        }
    });
    
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    
};
*/

// Initialize the scene
const {gl, camera} = setupScene(window, {lockOrientation: false});

// Get required WebGL extensions
const halfFloatExt = getExtension(gl, "OES_texture_half_float");
const colorBufferHalfFloatExt = getExtension(gl, "EXT_color_buffer_half_float");

// Create texture coordinates for boids (64x64 grid)
let textureCoords = new Float32Array(numBoids * 2);
for (let i = 0; i < numBoids; i++) {
    textureCoords[2 * i] = (i % 64 + 0.25) / 64;
    textureCoords[2 * i + 1] = (floor(i / 64) + 0.5) / 64;
}

// Attraction point (randomly moving target)
let attractorX = 0, attractorY = 0, attractorZ = 0;
setInterval(() => {
    attractorX = random() - 0.5;
    attractorY = random() - 0.5;
    attractorZ = random() - 0.5;
}, 250);

// Initialize boid data (positions and velocities)
let boidData = new Uint16Array(numBoids * 8);
for (let i = 0; i < numBoids;) {
    let x = random() - 0.5;
    let y = random() - 0.5;
    let z = random() - 0.5;
    
    // Only place boids within ellipsoid
    if (sqrt(x * x / min(camera.aspectRatio, 1) + y * y * max(camera.aspectRatio, 1) + z * z * 1.5) < 0.5) {
        boidData[8 * i] = floatToHalf(x);      // position x
        boidData[8 * i + 1] = floatToHalf(y);  // position y
        boidData[8 * i + 2] = floatToHalf(z);  // position z
        boidData[8 * i + 3] = floatToHalf(1);  // padding
        boidData[8 * i + 7] = floatToHalf(1);  // padding
        i++;
    }
}

// Create textures for ping-pong rendering
let currentTexture = createTexture(gl, halfFloatExt, boidData);
let nextTexture = createTexture(gl, halfFloatExt, null);

// Create buffers
let quadBuffer = gl.createBuffer();
let coordBuffer = gl.createBuffer();

// Simulation shader program
const createSimulationShader = () => {
    const program = gl.createProgram();
    
    // Vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision highp float;
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 1, 1);
        }
    `);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw Error(gl.getShaderInfoLog(vertexShader));
    }
    gl.attachShader(program, vertexShader);
    
    // Fragment shader - handles boid simulation
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision highp float;
        uniform highp sampler2D boidTexture;
        uniform vec3 attractor;
        
        const vec2 textureSize = vec2(128, 64);
        
        vec4 sampleBoid(vec2 coord, int offset) {
            vec2 texCoord = (coord + vec2(offset, 0)) / textureSize;
            return texture2D(boidTexture, texCoord);
        }
        
        vec4 getCurrentBoid(int offset) {
            return sampleBoid(gl_FragCoord.xy, offset);
        }
        
        void updatePosition() {
            vec3 position = getCurrentBoid(0).xyz;
            vec3 velocity = getCurrentBoid(1).xyz;
            position += velocity * 0.013;
            gl_FragColor = vec4(position, 1.0);
        }
        
        void updateVelocity() {
            vec3 position = getCurrentBoid(-1).xyz;
            vec3 velocity = getCurrentBoid(0).xyz;
            
            vec3 separation = vec3(0.0);
            vec3 alignment = vec3(0.0);
            vec3 cohesion = vec3(0.0);
            
            float separationCount = 0.0;
            float alignmentCount = 0.0;
            
            // Check all other boids
            for (int x = 0; x < 128; x += 2) {
                for (int y = 0; y < 64; y++) {
                    vec3 otherPos = sampleBoid(vec2(x, y), 0).xyz;
                    vec3 otherVel = sampleBoid(vec2(x, y), 1).xyz;
                    
                    float distance = distance(position, otherPos);
                    
                    // Separation: avoid crowding neighbors
                    float separationWeight = 1.0 - smoothstep(0.035, 0.07, distance);
                    separation += (position - otherPos) * separationWeight;
                    
                    // Alignment: steer towards average heading of neighbors
                    float alignmentWeight = smoothstep(0.035, 0.07, distance) - smoothstep(0.15, 0.3, distance);
                    separationCount += alignmentWeight;
                    alignment += (otherPos - position) * alignmentWeight;
                    
                    // Cohesion: steer towards average position of neighbors
                    float cohesionWeight = 1.0 - smoothstep(0.075, 0.15, distance);
                    alignmentCount += cohesionWeight;
                    cohesion += otherVel * cohesionWeight;
                }
            }
            
            separationCount += 1e-5;
            alignmentCount += 1e-5;
            
            // Attraction to center point
            float attractionWeight = 1.0 - smoothstep(0.25, 0.5, distance(position, attractor));
            vec3 attraction = (position - attractor) * attractionWeight;
            
            // Combine all forces
            vec3 newVelocity = normalize(
                velocity + 
                separation * 0.1 +
                step(0.01, separationCount) * alignment / separationCount * 0.01 +
                step(0.01, alignmentCount) * cohesion / alignmentCount * 0.03 +
                step(0.01, attractionWeight) * attraction * 0.04 -
                normalize(position) * smoothstep(0.6, 1.2, length(position)) * 0.01
            );
            
            // Speed control
            float speedAdjustment = 0.05 * sign(dot(alignment / separationCount, velocity));
            float speed = clamp(length(velocity) + speedAdjustment, 0.15, 0.2);
            
            gl_FragColor = vec4(newVelocity * speed, 1);
        }
        
        void main() {
            int dataType = int(mod(gl_FragCoord.x, 2.0));
            if (dataType == 0) {
                updatePosition();
            } else if (dataType == 1) {
                updateVelocity();
            }
        }
    `);
    
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw Error(gl.getShaderInfoLog(fragmentShader));
    }
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw Error(gl.getProgramInfoLog(program));
    }
    
    return program;
};

let simulationProgram = createSimulationShader();
let simTextureUniform = gl.getUniformLocation(simulationProgram, "boidTexture");
let simPositionAttrib = gl.getAttribLocation(simulationProgram, "position");
let simAttractorUniform = gl.getUniformLocation(simulationProgram, "attractor");

// Create framebuffers for ping-pong rendering
let currentFramebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, currentFramebuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, currentTexture, 0);

let nextFramebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, nextFramebuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, nextTexture, 0);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// Setup VAO for simulation
let simVAO = gl.createVertexArray();
gl.bindVertexArray(simVAO);
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
gl.enableVertexAttribArray(simPositionAttrib);
gl.vertexAttribPointer(simPositionAttrib, 2, gl.FLOAT, false, 0, 0);
gl.bindVertexArray(null);

// Rendering shader program
const createRenderShader = () => {
    const program = gl.createProgram();
    
    // Vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision mediump float;
        uniform float pointSize;
        uniform highp sampler2D boidTexture;
        uniform mat4 viewMatrix, projectionMatrix;
        varying lowp vec3 color;
        attribute vec2 texCoord;
        
        void main() {
            gl_Position = projectionMatrix * viewMatrix * texture2D(boidTexture, texCoord);
            gl_PointSize = pointSize / gl_Position.w;
            color = vec3(0.1, 0.2, 0.2) + gl_Position.z / 12.0;
        }
    `);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw Error(gl.getShaderInfoLog(vertexShader));
    }
    gl.attachShader(program, vertexShader);
    
    // Fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision mediump float;
        varying lowp vec3 color;
        
        void main() {
            if (distance(gl_PointCoord.xy, vec2(0.5)) > 0.5) discard;
            gl_FragColor = vec4(color, 1);
        }
    `);
    
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw Error(gl.getShaderInfoLog(fragmentShader));
    }
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw Error(gl.getProgramInfoLog(program));
    }
    
    return program;
};

let renderProgram = createRenderShader();
let renderTextureUniform = gl.getUniformLocation(renderProgram, "boidTexture");
let renderPointSizeUniform = gl.getUniformLocation(renderProgram, "pointSize");
let renderViewUniform = gl.getUniformLocation(renderProgram, "viewMatrix");
let renderProjectionUniform = gl.getUniformLocation(renderProgram, "projectionMatrix");
let renderTexCoordAttrib = gl.getAttribLocation(renderProgram, "texCoord");

// Setup VAO for rendering
let renderVAO = gl.createVertexArray();
gl.bindVertexArray(renderVAO);
gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);
gl.enableVertexAttribArray(renderTexCoordAttrib);
gl.vertexAttribPointer(renderTexCoordAttrib, 2, gl.FLOAT, false, 0, 0);
gl.bindVertexArray(null);

gl.depthFunc(gl.LEQUAL);

// Main render loop
const startRenderLoop = () => {
    const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        
        // Simulation pass
        gl.useProgram(simulationProgram);
        gl.viewport(0, 0, 256, 256);
        gl.uniform3f(simAttractorUniform, attractorX, attractorY, attractorZ);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, currentTexture);
        gl.uniform1i(simTextureUniform, 0);
        gl.bindVertexArray(simVAO);
        gl.bindFramebuffer(gl.FRAMEBUFFER, nextFramebuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        // Swap textures and framebuffers
        [currentTexture, nextTexture] = [nextTexture, currentTexture];
        [currentFramebuffer, nextFramebuffer] = [nextFramebuffer, currentFramebuffer];
        
        // Render pass
        gl.useProgram(renderProgram);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(renderPointSizeUniform, 
            min(gl.drawingBufferWidth, gl.drawingBufferHeight) / 1000 * 14 + camera.pixelRatio);
        gl.uniformMatrix4fv(renderViewUniform, false, camera.projectionMatrix);
        gl.uniformMatrix4fv(renderProjectionUniform, false, camera.viewMatrix);
        gl.enable(gl.DEPTH_TEST);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(renderTextureUniform, 0);
        gl.bindVertexArray(renderVAO);
        
        // Draw boids twice (for ping-pong textures)
        gl.bindTexture(gl.TEXTURE_2D, currentTexture);
        gl.drawArrays(gl.POINTS, 0, numBoids);
        // gl.bindTexture(gl.TEXTURE_2D, nextTexture);
        // gl.drawArrays(gl.POINTS, 0, numBoids);
        
        gl.disable(gl.DEPTH_TEST);
    };
    
    requestAnimationFrame(renderFrame);
};

export { startRenderLoop };
