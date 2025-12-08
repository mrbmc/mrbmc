import * as THREE from 'three';

// SVG crane coordinates extracted from kageki-crane.svg
// Scaled down and centered for 3D space
const SCALE = 0.02;
const CENTER_X = 300;
const CENTER_Y = 300;

function createShapeFromPath(pathData) {
  const shape = new THREE.Shape();
  
  // Parse path data and create shape
  const coords = pathData.match(/[\d.-]+/g).map(Number);
  
  // Scale and center coordinates
  const scaledCoords = [];
  for (let i = 0; i < coords.length; i += 2) {
    scaledCoords.push(
      (coords[i] - CENTER_X) * SCALE,
      -(coords[i + 1] - CENTER_Y) * SCALE  // Flip Y for Three.js coordinate system
    );
  }
  
  // Move to first point
  shape.moveTo(scaledCoords[0], scaledCoords[1]);
  
  // Line to remaining points
  for (let i = 2; i < scaledCoords.length; i += 2) {
    shape.lineTo(scaledCoords[i], scaledCoords[i + 1]);
  }
  
  shape.closePath();
  return shape;
}

export function createCraneGeometry() {
  // Five triangular shapes from the SVG
  const paths = [
    'M117.91 357.236L595.815 568.028L345.01 201.737L117.91 357.236Z',
    'M467.692 324.398L598.383 28.0964L371.283 183.595L467.692 324.398Z',
    'M99.8612 330.798L90.7493 130.222L187.159 271.024L99.8612 330.798Z',
    'M331.018 486.22L217.008 436.236L276.976 523.4L331.018 486.22Z',
    'M63.7152 131.56L0.000115456 175.118L65.5309 172.189L63.7152 131.56Z'
  ];
  
  const geometries = [];
  
  paths.forEach(pathData => {
    const shape = createShapeFromPath(pathData);
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelOffset: -0.1,
      bevelSegments: 1,
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometries.push(geometry);
  });
  
  // Merge all geometries into one
  const mergedGeometry = new THREE.BufferGeometry();
  const positionArrays = [];
  const normalArrays = [];
  const uvArrays = [];
  let totalVertices = 0;
  
  geometries.forEach(geom => {
    const positions = geom.attributes.position.array;
    const normals = geom.attributes.normal.array;
    const uvs = geom.attributes.uv ? geom.attributes.uv.array : null;
    
    positionArrays.push(positions);
    normalArrays.push(normals);
    if (uvs) uvArrays.push(uvs);
    totalVertices += positions.length / 3;
  });
  
  // Combine arrays
  const combinedPositions = new Float32Array(totalVertices * 3);
  const combinedNormals = new Float32Array(totalVertices * 3);
  const combinedUVs = new Float32Array(totalVertices * 2);
  
  let offset = 0;
  let uvOffset = 0;
  
  positionArrays.forEach((positions, i) => {
    combinedPositions.set(positions, offset);
    combinedNormals.set(normalArrays[i], offset);
    if (uvArrays[i]) {
      combinedUVs.set(uvArrays[i], uvOffset);
    }
    offset += positions.length;
    uvOffset += uvArrays[i] ? uvArrays[i].length : 0;
  });
  
  mergedGeometry.setAttribute('position', new THREE.BufferAttribute(combinedPositions, 3));
  mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(combinedNormals, 3));
  mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(combinedUVs, 2));
  
  mergedGeometry.computeBoundingSphere();
  
  return mergedGeometry;
}
