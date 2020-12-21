import * as THREE from "./three.module.js"

window.addEventListener('load', init);

let scene;
let camera;
let renderer;
let sceneObjects = [];
let myUniforms = {};
let threeDCrossColorAValue = 0xf9826c;
let threeDCrossColorBValue = 0x0096ea;
let ambientLightColorValue = 0x505050;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(ambientLightColorValue));
  scene.add(createColoredPointLight(0, 0, 0, threeDCrossColorAValue))

  sceneObjects.push(createSimpleCubeToPosition(-2));
  sceneObjects.push(createBoxWithShadersToPosition(1, 1, 3, 2));
  sceneObjects.push(createBoxWithShadersToPosition(3, 1, 1, 2));
  sceneObjects.push(createBoxWithShadersToPosition(1, 3, 1, 2));  

  sceneObjects.forEach(object => {
    scene.add(object);
  });

  animationLoop(camera);

}

function createColoredPointLight(x, y, z, color) {
  let pointLight = new THREE.PointLight(color);
  pointLight.position.set(x, y, z);

  return pointLight;
}

function createSimpleCubeToPosition(position) {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  // let material = new THREE.MeshLambertMaterial({
  //   color: 0x0096ea,
  //   emissive: 0x0016ea
  // });
  let material = new THREE.MeshNormalMaterial( {
    // color: 0x0096ea,
    transparent: true,
    opacity: 0.9,
    wireframe: true
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position;

  return mesh;
}

function createMeshToPosition(mesh, position) {
  mesh.position.x = position;

  return mesh;
}

// normal and position are attributes of each vertex (point) in the pipeline
function createVertexShader() {
  return `
    // varying – used for interpolated data 
    // between a vertex shader and a fragment shader.
    // Available for writing in the vertex shader, and read-only in a fragment shader. See Varying section.
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      // default shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `
}

function createFragmentShader() {
  return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        // gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
  `
}

function createBoxWithShadersToPosition(xLength, yLength, zLength, position) {
  myUniforms.colorA = { type: 'vec3', value: new THREE.Color(threeDCrossColorAValue) };
  myUniforms.colorB = { type: 'vec3', value: new THREE.Color(threeDCrossColorBValue) };

  // let geometry = new THREE.BoxGeometry(xLength, yLength, zLength);
  let geometry = new THREE.SphereGeometry(1.3, 50, 50);
  
  // let geometry = new THREE.PlaneBufferGeometry(20,20,100,100)
  let material = new THREE.ShaderMaterial({
    uniforms: myUniforms,
    fragmentShader: createFragmentShader(),
    vertexShader: createVertexShader(),
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position;

  return mesh;
}

function animationLoop() {
  renderer.render(scene, camera);

  for (let object of sceneObjects) {
    // smaller values make it rotate slower on the x / y axis
    object.rotation.x += 0.0055
    object.rotation.y += 0.0003
  }

  requestAnimationFrame(animationLoop);
}
