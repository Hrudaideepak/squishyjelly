/* ============================================================
   blob-jelly.js — Multi-Lobe Blob Behavior (Global)
   ============================================================ */

window.BlobJelly = class extends window.Jelly {
    constructor(audio) {
        super('canvas-container', audio);
        this.initJelly();
        this.animate();
    }

    initJelly() {
        // Octahedron gives that 3D Rhombus/Diamond shape
        const geo = new THREE.OctahedronGeometry(2.5, 4); 
        const pos = geo.attributes.position;
        const orig = new Float32Array(pos.array);
        
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffcc66,
            metalness: 0.1,
            roughness: 0.1,
            emissive: 0xffaa00,
            emissiveIntensity: 0.1
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.setJelly(mesh, geo, orig);
    }

    onHit(hit) {
        this.audio.playBlob(0.8, (hit.point.x / 3));
    }

    onRelease() {
        if (this.distort > 0.2) {
            this.audio.playBlob(this.distort * 0.5, 0);
        }
    }

    updateDistortion(t) {
        const pos = this.geometry.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v.fromArray(this.origPos, i * 3);
            
            const lobe1 = v.distanceTo(new THREE.Vector3(-1.5, 0, 0));
            const lobe2 = v.distanceTo(new THREE.Vector3(1.5, 0, 0));
            const lobe3 = v.distanceTo(new THREE.Vector3(0, 1.8, 0));
            
            let d = Math.sin(t * 1.5 + lobe1 * 0.8) * 0.08;
            d += Math.sin(t * 1.8 + lobe2 * 0.8) * 0.08;
            d += Math.sin(t * 2.1 + lobe3 * 0.8) * 0.08;
            
            if (this.hitPoint && this.distort > 0) {
                const dist = v.distanceTo(this.hitPoint);
                const limit = 2.5;
                if (dist < limit) {
                    const power = Math.pow(1 - dist / limit, 2);
                    d -= this.distort * 1.2 * power;
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
