import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DoubleSide, Mesh, SphereGeometry } from "three";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const metalnessColorTexture = textureLoader.load(
  "/textures/door/metalness.jpg"
);
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const ambientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorTexture = textureLoader.load("/textures/door/color.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// Scene
const scene = new THREE.Scene();

// Objects

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// material.side = DoubleSide;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 5000;
// material.specular = new THREE.Color("red");

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
// material.color = new THREE.Color("orange");
material.metalness = 1;
material.roughness = 0;
material.envMap = environmentMapTexture;

const doorMaterial = new THREE.MeshStandardMaterial();
doorMaterial.map = doorTexture;
doorMaterial.displacementMap = heightTexture;
doorMaterial.displacementScale = 0.05;
doorMaterial.normalMap = normalTexture;
doorMaterial.transparent = true;
doorMaterial.alphaMap = alphaTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(100).step(0.0001);
gui.add(doorMaterial, "displacementScale").min(0).max(0.1).step(0.0001);

// material.map = normalTexture;
// material.color.set("green");
// material.wireframe = true;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  doorMaterial
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

//      Scene Add Objects
scene.add(sphere, plane, torus);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Changing object position
sphere.position.x = -1;

torus.position.x = 1;

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  torus.rotation.y = 0.5 * elapsedTime;
  sphere.rotation.y = 0.5 * elapsedTime;
  plane.rotation.x = 1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
