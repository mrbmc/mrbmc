import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


var bounds = 10;
var numBoids = 100;



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0xFF4f00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


function drawBoid () {
	const x = 0, y = 0;
	const boidShape = new THREE.Shape();
	boidShape.moveTo( x, y );
	boidShape.bezierCurveTo( x+.05, y+.03, x+.05, y+.10, x+.20, y+.10 );
	boidShape.bezierCurveTo( x+.07, y+.07, x+.10, y+0.0, x+.15, y+0.0 );
	boidShape.bezierCurveTo( x+.10, y+0.0, x+.07, y-.07, x+.20, y-.10 );
	boidShape.bezierCurveTo( x+.05, y-.10, x+.05, y-.03, x, y);
	return boidShape;
}

var Things = Array(numBoids);
const geometries = [];
const color = new THREE.Color();
const boidShape = drawBoid();

for (var i = Things.length - 1; i >= 0; i--) {
	const geometry = new THREE.ShapeGeometry( boidShape );
	geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

	const amount = (Math.random() * bounds * 2) - bounds;


	var x = amount;//(Math.random() * bounds * 2) - bounds;
	var y = amount;//(Math.random() * bounds * 2) - bounds;
	var z = 0;
	var rz = (Math.random() * 360) * (Math.PI / 180);
	geometry.translate(x,y,z);
	geometry.rotateZ(rz);


    const hue = .0527;//THREE.MathUtils.lerp(1.0, 0.31, 0.2);
    const saturation = 1;
    const lightness = 0.5;//THREE.MathUtils.lerp(0.4, 1.0, 0.5);
    color.setHSL(hue, saturation, lightness);
    // get the colors as an array of values from 0 to 255
    const rgb = color.toArray().map(v => v * 255);
 
    // make an array to store colors for each vertex
    const numVerts = geometry.getAttribute('position').count;
    const itemSize = 3;  // r, g, b
    const colors = new Uint8Array(itemSize * numVerts);
 
    // copy the color into the colors array for each vertex
    colors.forEach((v, ndx) => {
      colors[ndx] = rgb[ndx % 3];
    });
 
    const normalized = true;
    const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
    geometry.setAttribute('color', colorAttrib);


	geometries.push(geometry);
}

const mergedGeometry = BufferGeometryUtils.mergeGeometries( geometries, false);
const material = new THREE.MeshBasicMaterial( { vertexColors: true } );
// const material = new THREE.MeshBasicMaterial( { color } );
const mesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mesh);


function animate() {
	// cube.rotation.x += 0.013;
	// cube.rotation.y += 0.008;
	// cube.rotation.z += 0.005;

	// mesh.rotation.z = 135 * (Math.PI / 180);
	// mesh.position.x += 0.002;
	// mesh.position.y -= 0.002;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );