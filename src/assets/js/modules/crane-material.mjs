import * as THREE from 'three';

/**
 * Create a realistic prismatic glass material for the crane
 * @param {Object} config - Material configuration object
 * @returns {MeshPhysicalMaterial}
 */
export function createGlassMaterial(config = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    // attenuationColor: 0xDCDDF9,
    // attenuationDistance: 3.5,
    specularColor: 0xff4f00,    // Orange specular highlights
    metalness: 0.1,        // Almost non-metallic
    roughness: 0.2,           // Perfect smoothness for clear refraction
    transmission: 1.0,       // High transmission with slight visibility
    thickness: 4.7,           // Thicker for more dramatic light bending
    ior: 2.417,               // Diamond IOR for maximum dispersion/prism effect
    reflectivity: 0.3,        // Moderate reflectivity for edge definition
    envMapIntensity: 0.1,     // Strong environment for prismatic colors
    dispersion: 5.5,          // Chromatic aberration for rainbow splitting
    transparent: true,
    side: THREE.DoubleSide,
  });
}
