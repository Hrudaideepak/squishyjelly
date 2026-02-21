/* ============================================================
   jelly-factory.js — Non-Modular Jelly Base
   ============================================================ */

window.Jelly = class {
    constructor(containerId, audio) {
        this.container = document.getElementById(containerId) || document.body;
        this.audio = audio;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        this.mesh = null;
        this.geometry = null;
        this.origPos = null;
        
        this.isPointerDown = false;
        this.distort = 0;
        this.hitPoint = null;
        this.raycaster = new THREE.Raycaster();
        
        this.initScene();
        this.initLights();
        this.initAtmosphere();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    initScene() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050512, 0.045);

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        this.camera.position.set(0, 1.5, 8);

        // OrbitControls is usually THREE.OrbitControls in the global version
        const Controls = THREE.OrbitControls || window.OrbitControls;
        this.controls = new Controls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;

        window.addEventListener('resize', () => {
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || window.innerHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });

        window.addEventListener('pointerdown', e => this.onPointerDown(e));
        window.addEventListener('pointermove', e => this.onPointerMove(e));
        window.addEventListener('pointerup', () => this.onPointerUp());
    }

    initLights() {
        this.scene.add(new THREE.AmbientLight(0x202040, 1.5));
        const key = new THREE.DirectionalLight(0xffeecc, 1.8);
        key.position.set(5, 8, 6);
        key.castShadow = true;
        this.scene.add(key);
        const rim = new THREE.DirectionalLight(0xffccaa, 0.5);
        rim.position.set(0, -3, -8);
        this.scene.add(rim);
    }

    initAtmosphere() {
        const floorGeo = new THREE.PlaneGeometry(50, 50);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x050512, transparent: true, opacity: 0.5 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.5;
        floor.receiveShadow = true;
        this.scene.add(floor);

        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(600 * 3);
        for (let i = 0; i < 600; i++) {
            const r = 25 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPos[i * 3 + 2] = r * Math.cos(phi);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        this.scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 })));
    }

    setJelly(mesh, geometry, origPos) {
        this.mesh = mesh;
        this.geometry = geometry;
        this.origPos = origPos;
        this.scene.add(this.mesh);
    }

    onPointerDown(e) {
        // More resilient check for clicking 'through' the UI layer
        const isCanvasTarget = e.target === this.renderer.domElement || e.target === this.container;
        if (!isCanvasTarget) return;

        this.isPointerDown = true;
        this.controls.enabled = false;
        const ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(ndc, this.camera);
        const hits = this.raycaster.intersectObject(this.mesh);
        if (hits.length) {
            this.hitPoint = this.mesh.worldToLocal(hits[0].point.clone());
            this.onHit(hits[0]);
        } else {
            this.isPointerDown = false;
            this.controls.enabled = true;
        }
    }

    onPointerMove(e) {
        if (!this.isPointerDown) return;
        const ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(ndc, this.camera);
        const sphere = new THREE.Sphere(this.mesh.position, 2.5);
        const hit = this.raycaster.ray.intersectSphere(sphere, new THREE.Vector3());
        if (hit) {
            this.hitPoint = this.mesh.worldToLocal(hit.clone());
            this.distort = Math.min(this.distort + 0.08, 1.0);
        }
    }

    onPointerUp() {
        this.isPointerDown = false;
        this.controls.enabled = true;
        this.onRelease();
    }

    onHit(hit) {}
    onRelease() {}
    updateDistortion(t) {}

    animate() {
        requestAnimationFrame(() => this.animate());
        const t = this.clock.getElapsedTime();
        if (this.isPointerDown) {
            this.distort = Math.min(this.distort + 0.05, 1.0);
        } else {
            this.distort *= 0.92;
            if (this.distort < 0.001) this.distort = 0;
        }
        if (!this.prefersReducedMotion) {
            this.updateDistortion(t);
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
};
