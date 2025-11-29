import * as THREE from 'three';

/**
 * Create a realistic prismatic glass material for the crane
 * @param {Object} config - Material configuration object
 * @returns {MeshPhysicalMaterial}
 */
export function createGlassMaterial(config = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,          // Pure white - no color tint
    specularColor: 0xff004f,    // Orange specular highlights
    specularIntensity: 0.2,  // Full intensity for sharp highlights
    metalness: 0.05,        // Almost non-metallic
    roughness: 0.2,           // Perfect smoothness for clear refraction
    transmission: 0.999,       // High transmission with slight visibility
    thickness: 4.7,           // Thicker for more dramatic light bending
    ior: 2.417,               // Diamond IOR for maximum dispersion/prism effect
    reflectivity: 0.3,        // Moderate reflectivity for edge definition
    envMapIntensity: 0.1,     // Strong environment for prismatic colors
    dispersion: 5.5,          // Chromatic aberration for rainbow splitting
    transparent: true,
    side: THREE.DoubleSide,
  });
}
