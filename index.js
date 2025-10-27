import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
camera.rotation.x = 6;

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

const controls = new OrbitControls(camera, renderer.domElement); //контроль над камерой
controls.enableDamping = true;
controls.dampingFactor = 0.05; // значение для замедления
controls.screenSpacePanning = false; //отключаем панорамирование
controls.minDistance = 2;
controls.maxDistance = 10;

//создание плоскости
const road = new THREE.Mesh(
  new THREE.BoxGeometry(30, 0.5, 20), // ширина, толщина, глубина
  new THREE.MeshStandardMaterial({ color: "#333" })
);
road.position.y = -0.25; 
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

//управление машинкой через клавиши
let angle = 0;
let isMoving = false;

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") isMoving = true;
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") isMoving = false;
});

function moveCar() {
  if (!car || !isMoving) return;
  angle += 0.01;
  car.position.x = 5 * Math.cos(angle);
  car.position.z = 5 * Math.sin(angle);
  car.rotation.y = -angle;
}

//функция для постоянного рендера и анимации
function animate() {
  requestAnimationFrame(animate);
  moveCar();

  controls.update();

  renderer.setClearColor("#9eafbe");
  renderer.render(scene, camera);
}

animate();
