import * as THREE from "./three.module.js"

window.addEventListener('load', init);

let scene;
let camera;
let renderer;
let sceneObjects = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    sceneObjects.push(createSimpleMeshToPosition(new THREE.BoxGeometry(1, 1, 1), 0));

    sceneObjects.forEach(object => {
        scene.add(object);
    });

    animationLoop(camera);

    document.getElementById('simple-cube').appendChild(renderer.domElement);
}

function createSimpleMeshToPosition(geometry, position) {
    let material = new THREE.MeshNormalMaterial({
        color: 0x3b3b3b,
        // transparent: false,
        // opacity: 0.999,
        // wireframe: false
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position;

    return mesh;
}


function animationLoop() {
    renderer.render(scene, camera);

    for (let object of sceneObjects) {
        // smaller values make it rotate slower on the x / y axis
        object.rotation.x += 0.0155
        object.rotation.y += 0.0003
    }

    requestAnimationFrame(animationLoop);
}
