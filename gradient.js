import * as THREE from "./three.module.js"

window.addEventListener('load', init);

let scene;
let camera;
let renderer;
let sceneObjects = [];
let myUniforms = {};

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene.add(new THREE.AmbientLight(0x505050));

  sceneObjects.push(createGradientMeshToPosition(0xf9826c, 0x0096ea, new THREE.SphereGeometry(1.3, 50, 50), 0));

  sceneObjects.forEach(object => {
    scene.add(object);
  });

  animationLoop(camera);

  document.getElementById('gradient').appendChild(renderer.domElement);

}

// normal and position are attributes of each vertex (point) in the pipeline
function createVertexShaderForGradient() {
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

function createFragmentShaderForGradient() {
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

function createGradientMeshToPosition(colorAValue, colorBValue, geometry, position, effectType) {
  myUniforms.colorA = { type: 'vec3', value: new THREE.Color(colorAValue) };
  myUniforms.colorB = { type: 'vec3', value: new THREE.Color(colorBValue) };
  
  let material = new THREE.ShaderMaterial({
    uniforms: myUniforms,
    fragmentShader: createFragmentShaderForGradient(),
    vertexShader: createVertexShaderForGradient(),
    wireframe: true
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
