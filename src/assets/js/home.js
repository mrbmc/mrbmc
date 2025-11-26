import { CraneScene } from './modules/crane-scene.mjs';

window.addEventListener('load', function(e) {
    "use strict";
	// startRenderLoop();
},false);

// Initialize the crane scene when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('crane-canvas');
  if (canvas) {
    const craneScene = new CraneScene(canvas);
    craneScene.init();
    craneScene.animate();
  }
});
