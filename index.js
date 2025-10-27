import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// сцена
const scene = new THREE.Scene();

// камера
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 10);
camera.rotation.x = 6

//свет
const ambientLight = new THREE.AmbientLight("white", 0.5); //цвет и интенсивность цвета
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight("white", 1);
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true;
scene.add(dirLight);

//рендер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//создание плоскости
const texture = new THREE.TextureLoader().load("/assets/road.jpg");
const textureMaterial = new THREE.MeshBasicMaterial({ map: texture });
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 20),
  new THREE.MeshStandardMaterial({ color: "#333" })
  // textureMaterial
);
road.rotation.x = -Math.PI / 2;
scene.add(road);

///Загрузка модели
const loader = new GLTFLoader();
let car;
loader.load(
  "/models/toy_car/scene.gltf",
  (gltf) => {
    car = gltf.scene;
    car.position.set(0, 0, 0);
    car.scale.set(0.5, 0.5, 0.5);
    scene.add(car);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("Error: " + error);
  }
);

let angle = 0;
function moveCar() {
  if (!car) return;
  angle += 0.01;
  car.position.x = 5 * Math.cos(angle);
  car.position.z = 5 * Math.sin(angle);
  car.rotation.y = -angle;
}

//Точки
const infoPoints = [
  { position: new THREE.Vector3(5, 0, 0), message: "ololo" },
  { position: new THREE.Vector3(-5, 0, 0), message: "ololo" },
  { position: new THREE.Vector3(0, 0, 5), message: "ololo" },
];

//функция для постоянного рендера и анимации
function animate() {
  requestAnimationFrame(animate);
  moveCar();

  renderer.setClearColor("#9eafbe");
  renderer.render(scene, camera);
}

animate();
