import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createCraneGeometry } from './crane-geometry.mjs';
import { createGlassMaterial } from './crane-material.mjs';
import { setupLighting } from './crane-lighting.mjs';

export class CraneScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.craneMesh = null;
    this.lights = {};
    this.startTime = Date.now();
    this.isAnimating = false;
    
    // Mouse interaction state
    this.mouse = {
      isDragging: false,
      hasInteracted: false,
      previousX: 0,
      previousY: 0,
      rotationY: 0,
      rotationX: 0,
      velocityY: 0,
      velocityX: 0
    };

    // Configuration
    this.config = {
      rotationSpeed: 3.0,
      rotationAmplitude: Math.PI / 6, // 30 degrees
      rotationOffset: Math.PI / 12, // 30 degrees base rotation
      mouseSensitivity: 0.002 ,
      damping: 0.5,
      returnSpeed: 0.025,
      cameraDistance: function() {
        const delta = Math.abs(1.4 - (window.innerWidth / window.innerHeight));
        const factor = 1 + (delta * 1.2);
        return 10 * factor;
      },
      // Landscape positioning
      isLandscape: function() {
        return window.innerWidth > window.innerHeight && window.innerWidth / window.innerHeight > 1.2;
      },
      cameraOffsetX: function() {
        // Move camera to the left (negative X) so crane appears on right
        return this.isLandscape() ? 8 : 0;
      },
      lookAtOffsetX: function() {
        // Adjust look-at target to keep crane centered in right half
        return this.isLandscape() ? 4 : 0;
      }
    };
    
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x00010F);

    // Camera
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.2, 1000);
    const offsetX = this.config.cameraOffsetX();
    const lookAtX = this.config.lookAtOffsetX();
    this.camera.position.set(offsetX, 0, this.config.cameraDistance());
    this.camera.lookAt(lookAtX, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3.2;  // Maximum exposure for diamond brilliance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Setup lights using dedicated module
    this.lights = setupLighting(this.scene);
    
    // Create crane mesh
    const geometry = createCraneGeometry();
    const material = createGlassMaterial();
    this.craneMesh = new THREE.Mesh(geometry, material);
    this.craneMesh.castShadow = true;
    this.craneMesh.receiveShadow = true;
    // Flip horizontally by inverting X scale
    this.craneMesh.scale.x = -1;
    this.scene.add(this.craneMesh);

    // Setup post-processing with subtle bloom
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Subtle bloom pass - only highlights glow
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.2,    // strength - subtle glow
      0.6,    // radius - soft spread
      0.85    // threshold - only bright areas glow
    );
    this.composer.addPass(bloomPass);
    
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // Mouse controls
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('mouseleave', this.onMouseUp);
    this.canvas.style.cursor = 'grab';
    
    window.addEventListener('resize', this.onWindowResize);
    this.isAnimating = true;
  }
  
  onWindowResize() {
    console.log('Window resized');
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.z = this.config.cameraDistance();
    // Update camera offset for landscape
    const offsetX = this.config.cameraOffsetX();
    const lookAtX = this.config.lookAtOffsetX();
    this.camera.position.x = offsetX;
    this.camera.lookAt(lookAtX, 0, 0);
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }
  
  onMouseDown(event) {
    this.mouse.isDragging = true;
    this.mouse.hasInteracted = true;
    this.mouse.previousX = event.clientX;
    this.mouse.previousY = event.clientY;
    this.canvas.style.cursor = 'grabbing';
  }
  
  onMouseMove(event) {
    if (!this.mouse.isDragging) return;
    
    const deltaX = event.clientX - this.mouse.previousX;
    const deltaY = event.clientY - this.mouse.previousY;
    
    this.mouse.velocityY = deltaX * this.config.mouseSensitivity;
    this.mouse.velocityX = deltaY * this.config.mouseSensitivity;
    
    this.mouse.rotationY += this.mouse.velocityY;
    this.mouse.rotationX += this.mouse.velocityX;
    
    // Clamp X rotation to prevent flipping
    this.mouse.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouse.rotationX));
    
    this.mouse.previousX = event.clientX;
    this.mouse.previousY = event.clientY;
  }
  
  onMouseUp() {
    this.mouse.isDragging = false;
    this.mouse.hasInteracted = false;
    this.canvas.style.cursor = 'grab';
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    requestAnimationFrame(() => this.animate());
    
    if (this.craneMesh) {
      // Calculate target auto-animation rotation
      const elapsed = (Date.now() - this.startTime) * 0.001;
      const targetRotationY = Math.sin(elapsed * this.config.rotationSpeed * 0.1) * this.config.rotationAmplitude + this.config.rotationOffset;
      // const targetRotationX = Math.sin(elapsed * this.config.rotationSpeed * 0.05) * (this.config.rotationAmplitude/2) - (Math.PI / 10);
      const targetRotationX = (Math.PI / -30);
      
      if (!this.mouse.hasInteracted) {
        // Smoothly interpolate back to auto-animation
        this.mouse.rotationY += (targetRotationY - this.mouse.rotationY) * this.config.returnSpeed;
        this.mouse.rotationX += (targetRotationX - this.mouse.rotationX) * this.config.returnSpeed;

        // Snap to target when very close
        if (Math.abs(targetRotationY - this.mouse.rotationY) < 0.001) {
          this.mouse.rotationY = targetRotationY;
        }
        if (Math.abs(targetRotationX - this.mouse.rotationX) < 0.001) {
          this.mouse.rotationX = targetRotationX;
        }
        
      } else if (!this.mouse.isDragging) {
        // Apply damping when released but keep user's rotation
        this.mouse.velocityY *= this.config.damping;
        this.mouse.velocityX *= this.config.damping;
        this.mouse.rotationY += this.mouse.velocityY;
        this.mouse.rotationX += this.mouse.velocityX;
        
        // Clamp X rotation
        this.mouse.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouse.rotationX));
      }
      
      // Apply rotation to mesh
      this.craneMesh.rotation.y = this.mouse.rotationY;
      this.craneMesh.rotation.x = this.mouse.rotationX;
    }
    
    this.composer.render();
  }

}