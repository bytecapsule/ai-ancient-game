import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // 设置相机位置
        this.camera.position.z = 50;

        // 创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 100;

        // 存储天体对象
        this.celestialBodies = {};

        // 初始化场景
        this.init();

        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        this.addLights();
        this.addStarfield();
        this.createSun();
        this.createPlanets();
        this.createOrbits();
        this.animate();
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 300);
        this.scene.add(pointLight);
    }

    addStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            sizeAttenuation: true
        });

        const stars = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(2000);
            const y = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloatSpread(2000);
            stars.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
    }

    createSun() {
        const textureLoader = new THREE.TextureLoader();
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('./textures/sun.jpg'),
            emissive: 0xffff00,
            emissiveIntensity: 0.5,
            shininess: 0
        });

        this.celestialBodies.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.celestialBodies.sun);
    }

    createPlanets() {
        const planets = [
            { name: 'mercury', size: 0.8, distance: 10, texture: 'mercury.jpg', speed: 0.01 },
            { name: 'venus', size: 1.2, distance: 15, texture: 'venus_atmosphere.jpg', speed: 0.007 },
            { name: 'earth', size: 1.5, distance: 20, texture: 'earth_atmos_2048.jpg', speed: 0.005 },
            { name: 'mars', size: 1, distance: 25, texture: 'mars.jpg', speed: 0.004 },
            { name: 'jupiter', size: 3, distance: 32, texture: 'jupiter.jpg', speed: 0.002 },
            { name: 'saturn', size: 2.5, distance: 38, texture: 'saturn.jpg', speed: 0.0015 },
            { name: 'uranus', size: 2, distance: 43, texture: 'uranus.jpg', speed: 0.001 },
            { name: 'neptune', size: 2, distance: 48, texture: 'neptune.jpg', speed: 0.0008 }
        ];

        const textureLoader = new THREE.TextureLoader();
        planets.forEach(planet => {
            const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                map: textureLoader.load(`./textures/${planet.texture}`),
                shininess: 5
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = planet.distance;

            const planetObj = {
                mesh,
                distance: planet.distance,
                speed: planet.speed,
                angle: Math.random() * Math.PI * 2
            };

            this.celestialBodies[planet.name] = planetObj;
            this.scene.add(mesh);
        });
    }

    createOrbits() {
        Object.values(this.celestialBodies).forEach(body => {
            if (body.distance) {
                const orbitGeometry = new THREE.RingGeometry(body.distance - 0.1, body.distance + 0.1, 128);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0x666666,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                this.scene.add(orbit);
            }
        });
    }

    updatePlanets() {
        Object.values(this.celestialBodies).forEach(body => {
            if (body.speed) {
                body.angle += body.speed;
                body.mesh.position.x = Math.cos(body.angle) * body.distance;
                body.mesh.position.z = Math.sin(body.angle) * body.distance;
                body.mesh.rotation.y += body.speed * 2;
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 更新行星位置
        this.updatePlanets();

        // 太阳自转
        if (this.celestialBodies.sun) {
            this.celestialBodies.sun.rotation.y += 0.001;
        }

        // 更新控制器
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}

// 创建太阳系实例
new SolarSystem();