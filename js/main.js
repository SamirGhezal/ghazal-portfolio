import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ParticleSystem } from './modules/particles.js';
import { SectionManager } from './modules/sections.js';
import { WasmLoader } from './modules/wasm-loader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0A0A0A);
scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0005);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85));

scene.add(new THREE.AmbientLight(0x333333));
const light = new THREE.PointLight(0xFFD700, 2, 30);
light.position.set(5,5,5);
scene.add(light);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 64, 64),
  new THREE.MeshStandardMaterial({color:0xFFD700, roughness:0.2, metalness:0.8, emissive:0xFFD700, emissiveIntensity:0.4})
);
scene.add(sphere);

const particles = new ParticleSystem(scene);
const sections = new SectionManager(scene);
new WasmLoader();

function animate() {
  requestAnimationFrame(animate);
  const t = Date.now()*0.001;
  sphere.rotation.y = t*0.2;
  particles.update(t);
  sections.update(t);
  controls.update();
  composer.render();
}
animate();

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});