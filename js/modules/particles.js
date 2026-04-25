import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    const geo = new THREE.BufferGeometry();
    const cnt = 1500;
    const pos = new Float32Array(cnt*3);
    for(let i=0; i<cnt*3; i++) pos[i] = (Math.random()-0.5)*20;
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    this.pts = new THREE.Points(geo, new THREE.PointsMaterial({size:0.03, color:0xFFD700, blending:THREE.AdditiveBlending}));
    scene.add(this.pts);
  }
  update(t) { this.pts.rotation.y = t*0.05; }
}