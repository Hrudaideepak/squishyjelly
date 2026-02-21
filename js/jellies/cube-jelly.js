/* ============================================================
   cube-jelly.js — Elastic Cube Behavior (Global)
   ============================================================ */

window.CubeJelly = class extends window.Jelly {
    constructor(audio) {
        super('canvas-container', audio);
        this.initJelly();
        this.animate();
    }

    initJelly() {
        const geo = new THREE.BoxGeometry(3.5, 3.5, 3.5, 32, 32, 32);
        const pos = geo.attributes.position;
        const orig = new Float32Array(pos.array);
        
        const mat = new THREE.MeshStandardMaterial({
            color: 0x88ffaa,
            metalness: 0.2,
            roughness: 0.2,
            flatShading: false,
            emissive: 0x00ff88,
            emissiveIntensity: 0.1
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.setJelly(mesh, geo, orig);
    }

    onHit(hit) {
        this.audio.playCube(0.7, (hit.point.x / 3));
    }

    onRelease() {
        if (this.distort > 0.2) {
            this.audio.playCube(this.distort * 0.4, 0);
        }
    }

    updateDistortion(t) {
        const pos = this.geometry.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v.fromArray(this.origPos, i * 3);
            
            let d = Math.sin(t * 1.2 + v.y * 0.5) * 0.05;
            
            if (this.hitPoint && this.distort > 0) {
                const dist = v.distanceTo(this.hitPoint);
                const limit = 3.0;
                if (dist < limit) {
                    const power = Math.pow(1 - dist / limit, 1.5);
                    d += this.distort * 1.2 * power;
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
