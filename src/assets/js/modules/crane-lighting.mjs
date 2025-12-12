import * as THREE from 'three';

/**
 * Setup all lighting for the crane scene to maximize diamond sparkle
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {Object} Object containing all light references
 */
export function setupLighting(scene) {
  const lights = {};
  
  // Very bright ambient light
  // lights.ambient = new THREE.AmbientLight(0xffffff, 2.5);
  // scene.add(lights.ambient);
  
  // Main key light - extremely bright white
  lights.mainWhite = new THREE.DirectionalLight(0xffffff, 2.0);
  lights.mainWhite.position.set(3, 7, 3);
  lights.mainWhite.castShadow = true;
  lights.mainWhite.shadow.mapSize.width = 2048;
  lights.mainWhite.shadow.mapSize.height = 2048;
  lights.mainWhite.shadow.camera.far = 50;
  lights.mainWhite.shadow.camera.left = -10;
  lights.mainWhite.shadow.camera.right = 10;
  lights.mainWhite.shadow.camera.top = 10;
  lights.mainWhite.shadow.camera.bottom = -10;
  scene.add(lights.mainWhite);
  
  // Indigo secondary light for cool tones
  lights.secondaryWhite = new THREE.DirectionalLight(0xCC66Cf, 4.5);
  lights.secondaryWhite.position.set(-5, 5, 4);
  lights.secondaryWhite.castShadow = true;
  lights.secondaryWhite.shadow.mapSize.width = 2048;
  lights.secondaryWhite.shadow.mapSize.height = 2048;
  // scene.add(lights.secondaryWhite);
  
  // Top light for crown brilliance
  lights.topLight = new THREE.DirectionalLight(0xCFD3FD, 4.0);
  lights.topLight.position.set(0, 10, 0);
  scene.add(lights.topLight);
  
  // highlight the left edges of the crane
  lights.coolRim = new THREE.DirectionalLight(0xCC66Cf, 4);
  lights.coolRim.position.set(-2, 1, 0);
  // lights.coolRim.target.position.set(0, 0, 0);
  // scene.add(lights.coolRim);
  
  // highlight the right edges of the crane
  lights.warmRim = new THREE.DirectionalLight(0x1F23AD, 8);
  lights.warmRim.position.set(2, 1, -1);
  // lights.warmRim.target.position.set(0, 0, 0);
  scene.add(lights.warmRim);
  
  // Strong back fill
  lights.backFill = new THREE.DirectionalLight(0xffffff, 3.0);
  lights.backFill.position.set(0, 0, -8);
  scene.add(lights.backFill);

  // Add prismatic colored accents for rainbow sparkle
  lights.prism1 = new THREE.DirectionalLight(0x1F23AD, 3.5, 30);  // indigo
  lights.prism1.position.set(8, 4, 6);
  scene.add(lights.prism1);
  
  lights.prism2 = new THREE.DirectionalLight(0xCC66Cf, 5.5, 30);  // pink
  lights.prism2.position.set(-12, 0, 8);
  scene.add(lights.prism2);
  
  lights.prism3 = new THREE.DirectionalLight(0xffeb6b, 8.0, 30);  // Gold
  lights.prism3.position.set(-2, 2, -4);
  scene.add(lights.prism3);
  
  return lights;
}
