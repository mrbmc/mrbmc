import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('boidsCanvas');
const width = window.innerWidth;
const height = window.innerHeight;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Boid properties
const boidsCount = 200;
const maxVelocity = 1.5;
const perceptionRadius = 10;

// Boid geometry and material
const boidGeometry = new THREE.SphereGeometry(0.3, 8, 8);
const boidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Boids array
const boids = [];

for (let i = 0; i < boidsCount; i++) {
    const boid = new THREE.Mesh(boidGeometry, boidMaterial);
    boid.position.set(
        Math.random() * 60 - 30,
        Math.random() * 40 - 20,
        Math.random() * 10
    );
    boid.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * maxVelocity,
        (Math.random() - 0.5) * maxVelocity,
        (Math.random() - 0.5) * maxVelocity
    );
    scene.add(boid);
    boids.push(boid);
}

// Update function
function updateBoids() {
    const acceleration = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < boidsCount; i++) {
        const boid = boids[i];
        const neighbors = [];

        for (let j = 0; j < boidsCount; j++) {
            if (i !== j) {
                const otherBoid = boids[j];
                const distance = boid.position.distanceTo(otherBoid.position);

                if (distance <= perceptionRadius) {
                    neighbors.push(otherBoid);
                }
            }
        }

        // Cohesion
        let cohesionSum = new THREE.Vector3(0, 0, 0);
        for (const neighbor of neighbors) {
            cohesionSum.add(neighbor.position);
        }
        if (neighbors.length > 0) {
            cohesionSum.divideScalar(neighbors.length);
            acceleration.subVectors(cohesionSum, boid.position).normalize();
            acceleration.multiplyScalar(0.1);
        }

        // Alignment
        let alignmentSum = new THREE.Vector3(0, 0, 0);
        for (const neighbor of neighbors) {
            alignmentSum.add(neighbor.velocity);
        }
        if (neighbors.length > 0) {
            alignmentSum.divideScalar(neighbors.length);
            acceleration.subVectors(alignmentSum, boid.velocity).normalize();
            acceleration.multiplyScalar(0.1);
        }

        // Separation
        let separationSum = new THREE.Vector3(0, 0, 0);
        for (const neighbor of neighbors) {
            const distance = boid.position.distanceTo(neighbor.position);
            if (distance > 0 && distance < perceptionRadius / 2) {
                separationSum.subVectors(boid.position, neighbor.position).normalize();
                separationSum.multiplyScalar(1 / distance);
            }
        }

        acceleration.add(separationSum);

        // Limit velocity
        const speed = boid.velocity.length();
        if (speed > maxVelocity) {
            boid.velocity.normalize().multiplyScalar(maxVelocity);
        } else {
            boid.velocity.add(acceleration);
        }
    }

    // Move boids
    for (let i = 0; i < boidsCount; i++) {
        const boid = boids[i];
        boid.position.add(boid.velocity);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    updateBoids();

    renderer.render(scene, camera);
}

animate();