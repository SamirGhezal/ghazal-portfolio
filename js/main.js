import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ---------- تجهيز المشهد ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0005);

const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.getElementById('scene-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// مؤثرات
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.5, 0.4, 0.85));

// إضاءة
scene.add(new THREE.AmbientLight(0x444444));
const light = new THREE.PointLight(0xFFD700, 2, 30);
light.position.set(5,5,8);
scene.add(light);

// الكرة المركزية
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({ color:0xFFD700, roughness:0.2, metalness:0.9, emissive:0xFFD700, emissiveIntensity:0.4 })
);
scene.add(sphere);

// حلقات
function addRing(rotX, rotY, rotZ) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.02, 16, 100),
    new THREE.MeshStandardMaterial({ color:0xFFD700, emissive:0xFFD700, emissiveIntensity:0.8 })
  );
  ring.rotation.set(rotX, rotY, rotZ);
  scene.add(ring);
  return ring;
}
const rings = [
  addRing(Math.PI/2, 0, 0),
  addRing(0, Math.PI/2, 0),
  addRing(Math.PI/3, Math.PI/4, 0)
];

// جسيمات
const particlesGeo = new THREE.BufferGeometry();
const pos = new Float32Array(1500 * 3);
for (let i=0; i<pos.length; i++) pos[i] = (Math.random()-0.5)*20;
particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({
  size: 0.03, color:0xFFD700, blending:THREE.AdditiveBlending
}));
scene.add(particles);

// أقمار الأقسام
const moons = [];
['about','skills','projects','contact'].forEach((name,i)=>{
  const angle = (i/4)*Math.PI*2;
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    new THREE.MeshStandardMaterial({ color:0xFFD700, emissive:0xFFD700, emissiveIntensity:0.6 })
  );
  moon.position.set(Math.cos(angle)*3, 0, Math.sin(angle)*3);
  moon.userData = { section: name };
  scene.add(moon);
  moons.push(moon);
});

// ---------- حلقة الرسم ----------
function animate() {
  requestAnimationFrame(animate);
  const t = Date.now() * 0.001;
  sphere.rotation.y = t * 0.2;
  rings.forEach((r,i) => { r.rotation.z += 0.003 * (i+1); r.rotation.x += 0.002; });
  particles.rotation.y = t * 0.03;
  moons.forEach((m,i)=>{
    const a = (i/moons.length)*Math.PI*2 + t*0.4;
    m.position.x = Math.cos(a)*3;
    m.position.z = Math.sin(a)*3;
  });
  controls.update();
  composer.render();
}
animate();

// معالجة تغيير حجم النافذة
window.addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

// ---------- واجهة المستخدم ----------
document.getElementById('aboutBtn').addEventListener('click', ()=>{
  document.getElementById('aboutModal').classList.toggle('active');
});
document.getElementById('closeModal').addEventListener('click', ()=>{
  document.getElementById('aboutModal').classList.remove('active');
});

// أزرار الأقسام
document.querySelectorAll('.nav-dot').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-dot').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
