import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Earth {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // 设置相机位置
        this.camera.position.z = 5;

        // 创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;

        // 创建地球
        this.createEarth();
        
        // 添加光照
        this.addLights();

        // 添加星空背景
        this.addStarfield();

        // 开始动画循环
        this.animate();

        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createEarth() {
        const textureLoader = new THREE.TextureLoader();
        
        // 加载地球纹理
        const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
            bumpMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
            bumpScale: 0.05,
            specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
            specular: new THREE.Color('grey'),
            shininess: 10
        });

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(this.earth);

        // 添加云层
        const cloudGeometry = new THREE.SphereGeometry(2.005, 64, 64);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png'),
            transparent: true,
            opacity: 0.4
        });

        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.clouds);

        // 添加大气层光晕
        const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
            transparent: true,
            opacity: 0.1
        });

        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(this.atmosphere);
    }

    addLights() {
        // 添加主光源（太阳光）
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(5, 3, 5);
        this.scene.add(sunLight);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
    }

    addStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05
        });

        const stars = [];
        for (let i = 0; i < 1000; i++) {
            const x = THREE.MathUtils.randFloatSpread(100);
            const y = THREE.MathUtils.randFloatSpread(100);
            const z = THREE.MathUtils.randFloatSpread(100);
            stars.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 地球自转
        this.earth.rotation.y += 0.001;
        this.clouds.rotation.y += 0.0012;
        this.atmosphere.rotation.y += 0.001;

        // 波动效果
        const time = Date.now() * 0.001;
        this.earth.position.y = Math.sin(time) * 0.1;
        this.clouds.position.y = Math.sin(time) * 0.1;
        this.atmosphere.position.y = Math.sin(time) * 0.1;

        // 更新控制器
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}

// 创建地球实例
const earth = new Earth();