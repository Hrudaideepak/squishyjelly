/* ============================================================
   starfish-jelly.js — Spiky Starfish Behavior (Global)
   ============================================================ */

window.StarfishJelly = class extends window.Jelly {
    constructor(audio) {
        super('canvas-container', audio);
        this.initJelly();
        this.animate();
    }

    initJelly() {
        const geo = new THREE.IcosahedronGeometry(2.5, 48);
        const pos = geo.attributes.position;
        const orig = new Float32Array(pos.array);
        
        for (let i = 0; i < pos.count; i++) {
            const v = new THREE.Vector3(orig[i*3], orig[i*3 + 1], orig[i*3 + 2]);
            const noise = (Math.sin(v.x * 5) * Math.cos(v.y * 5) * Math.sin(v.z * 5));
            if (noise > 0.3) {
                const s = 1.0 + (noise - 0.3) * 1.5;
                orig[i*3] *= s;
                orig[i*3 + 1] *= s;
                orig[i*3 + 2] *= s;
            }
        }
        pos.set(orig);
        
        const mat = new THREE.MeshStandardMaterial({
            color: 0xff6b9d,
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0xff0055,
            emissiveIntensity: 0.2
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.setJelly(mesh, geo, orig);
    }

    onHit(hit) {
        this.audio.playStarfish(0.8, (hit.point.x / 3));
    }

    onRelease() {
        if (this.distort > 0.2) {
            this.audio.playStarfish(this.distort * 0.5, 0);
        }
    }

    updateDistortion(t) {
        const pos = this.geometry.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v.fromArray(this.origPos, i * 3);
            let d = Math.sin(t * 2.0 + v.z * 0.7) * 0.04;
            
            if (this.hitPoint && this.distort > 0) {
                const dist = v.distanceTo(this.hitPoint);
                const limit = 2.0;
                if (dist < limit) {
                    const power = Math.pow(1 - dist / limit, 2);
                    d -= this.distort * 1.5 * power;
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
