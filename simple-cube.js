import * as THREE from "./three.module.js"

var scene,
    camera,
    renderer,
    sceneObjects = [],
    fov = 30;

window.addEventListener('load', init);

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneObjects.push(createSimpleMeshToPosition(new THREE.BoxGeometry(10, 10, 10), 0));

    sceneObjects.forEach(object => {
        scene.add(object);
    });

    animationLoop(camera);

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    document.getElementById('simple-cube').appendChild(renderer.domElement);
}

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

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
        object.rotation.x += 0.03
        object.rotation.y += 0.03
    }

    requestAnimationFrame(animationLoop);
}
