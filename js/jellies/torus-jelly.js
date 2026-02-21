/* ============================================================
   torus-jelly.js — Wobbly Torus Behavior (Global)
   ============================================================ */

window.TorusJelly = class extends window.Jelly {
    constructor(audio) {
        super('canvas-container', audio);
        this.initJelly();
        this.animate();
    }

    initJelly() {
        const geo = new THREE.TorusGeometry(3.0, 1.2, 32, 128);
        const pos = geo.attributes.position;
        const orig = new Float32Array(pos.array);
        
        const mat = new THREE.MeshStandardMaterial({
            color: 0xaa88ff,
            metalness: 0.5,
            roughness: 0.1,
            emissive: 0x5500ff,
            emissiveIntensity: 0.1
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.setJelly(mesh, geo, orig);
    }

    onHit(hit) {
        this.audio.playTorus(0.8, (hit.point.x / 4));
    }

    onRelease() {
        if (this.distort > 0.2) {
            this.audio.playTorus(this.distort * 0.4, 0);
        }
    }

    updateDistortion(t) {
        const pos = this.geometry.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v.fromArray(this.origPos, i * 3);
            const angle = Math.atan2(v.y, v.x);
            let d = Math.sin(t * 2.0 + angle * 4.0) * 0.1;
            
            if (this.hitPoint && this.distort > 0) {
                const dist = v.distanceTo(this.hitPoint);
                const limit = 2.5;
                if (dist < limit) {
                    const power = Math.pow(1 - dist / limit, 1.5);
                    d += this.distort * 1.5 * power;
                }
            }
            
            const majorR = 3.0;
            const center = new THREE.Vector3(v.x, v.y, 0).normalize().multiplyScalar(majorR);
            const normal = v.clone().sub(center).normalize();
            
            pos.setXYZ(i, 
                v.x + normal.x * d, 
                v.y + normal.y * d, 
                v.z + normal.z * d
            );
        }
        pos.needsUpdate = true;
    }
};
