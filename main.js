import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//texture loader
const loader = new THREE.TextureLoader();
const star = loader.load("./src/images/star.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

const particlesGeometery = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
//xyz, xyz, xyz, xyz

for (let i = 0; i < particlesCount * 3; i++) {
  // posArray[i] = Math.random();
  // posArray[i] = Math.random() - 0.5;
  posArray[i] = (Math.random() - 0.5) * Math.random() * 5;
}
particlesGeometery.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

// Materials
const geometryMaterial = new THREE.PointsMaterial({
  size: 0.005,
});
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.008,
  map: star,
  transparent: true,
});

// Mesh
const sphere = new THREE.Points(torusGeometry, geometryMaterial);
const particlesMesh = new THREE.Points(particlesGeometery, particlesMaterial);
scene.add(sphere, particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls;
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#21282a"), 1);

//mousemove
document.addEventListener("mousemove", animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

// Animate
const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  const currentTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.4 * currentTime;
  particlesMesh.rotation.y = 0.05 * currentTime;

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (currentTime * 0.00008);
    particlesMesh.rotation.y = mouseX * (currentTime * 0.00008);
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
