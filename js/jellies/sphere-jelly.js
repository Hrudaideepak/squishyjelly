/* ============================================================
   sphere-jelly.js — Sinusoidal Sphere Behavior (Global)
   ============================================================ */

window.SphereJelly = class extends window.Jelly {
    constructor(audio) {
        super('canvas-container', audio);
        this.initJelly();
        this.animate();
    }

    initJelly() {
        const geo = new THREE.IcosahedronGeometry(2.5, 64);
        const pos = geo.attributes.position;
        const orig = new Float32Array(pos.array);
        
        const mat = new THREE.MeshStandardMaterial({
            color: 0xff9a6c,
            metalness: 0.3,
            roughness: 0.1,
            flatShading: false,
            emissive: 0xff4400,
            emissiveIntensity: 0.2
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.setJelly(mesh, geo, orig);
    }

    onHit(hit) {
        this.audio.playSphere(0.8, (hit.point.x / 3));
    }

    onRelease() {
        if (this.distort > 0.2) {
            this.audio.playSphere(this.distort * 0.5, 0);
        }
    }

    updateDistortion(t) {
        const pos = this.geometry.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v.fromArray(this.origPos, i * 3);
            
            let d = Math.sin(t * 1.5 + v.y * 0.8) * 0.08;
            d += Math.cos(t * 2.0 + v.x * 0.5) * 0.05;
            
            if (this.hitPoint && this.distort > 0) {
                const dist = v.distanceTo(this.hitPoint);
                const limit = 2.2;
                if (dist < limit) {
                    const power = Math.pow(1 - dist / limit, 2);
                    d -= this.distort * 0.8 * power;
                }
            }
            
            const normal = v.clone().normalize();
            pos.setXYZ(i, 
                v.x + normal.x * d, 
                v.y + normal.y * d, 
                v.z + normal.z * d
            );
        }
        pos.needsUpdate = true;
    }
};
