import * as THREE from 'three';

export class SectionManager {
  constructor(scene) {
    this.moons = [];
    ['about','skills','projects','contact'].forEach((s,i)=>{
      const a = (i/4)*Math.PI*2;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.3,32,32),
        new THREE.MeshStandardMaterial({color:0xFFD700, emissive:0xFFD700, emissiveIntensity:0.5})
      );
      m.position.set(Math.cos(a)*3.5, 0, Math.sin(a)*3.5);
      m.userData = {section:s};
      scene.add(m);
      this.moons.push(m);
    });
  }
  update(t) {
    this.moons.forEach((m,i)=>{
      const a = (i/this.moons.length)*Math.PI*2 + t*0.3;
      m.position.x = Math.cos(a)*3.5;
      m.position.z = Math.sin(a)*3.5;
    });
  }
}