// Import necessary modules from three.js
import * as THREE from 'three';
import getLayer from "./getLayer.js";
import { getParticleSystem } from "./getParticleSystem.js";
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

// Create a new scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Define your custom shape using the Shape class
const shape = new THREE.Shape();
    shape.moveTo(-1, -1); // Starting point at (10, 10)
    shape.lineTo(1, -1); // Line to (50, 10)
    shape.lineTo(1, 1); // Line to (50, 50)
    shape.lineTo(-1, 1); // Line back to (10, 50)

// Create a ShapeGeometry from the defined shape
const geometry = new THREE.ShapeGeometry(shape);

// Define a material for your shape
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });

// Create a mesh by combining the geometry and material
const customShapeMesh = new THREE.Mesh(geometry, material);

// scene.add(customShapeMesh);



// instantiate a loader
const loader = new SVGLoader();

// load a SVG resource
loader.load(
    // resource URL
    '/images/profile/kageki-crane.svg',
    // called when the resource is loaded
    function ( data ) {

        const paths = data.paths;
        const group = new THREE.Group();

        for ( let i = 0; i < paths.length; i ++ ) {

            const path = paths[ i ];

            const material = new THREE.MeshBasicMaterial( {
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false
            } );

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {

                const shape = shapes[ j ];
                const geometry = new THREE.ShapeGeometry( shape );
                const mesh = new THREE.Mesh( geometry, material );
                group.add( mesh );

            }

        }

        scene.add( group );

    },
    // called when loading is in progress
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);


// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// // const material = new THREE.MeshBasicMaterial( { color: 0x0099CC } );
// const material = new THREE.MeshStandardMaterial( { color: 0x0099CC,} );
// const cube = new THREE.Mesh( geometry, material );
// // cube.position.z = 1;
// scene.add( cube );

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x808080);
scene.add(hemiLight);

// Sprites BG
const gradientBackground = getLayer({
  hue: 0.6,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -10.5,
});
scene.add(gradientBackground);


// Animation loop
function animate() {
    // requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    customShapeMesh.rotation.x += 0.01;
    customShapeMesh.rotation.y += 0.01;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

animate();