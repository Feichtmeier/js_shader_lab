import * as THREE from "./three.module.js"

var scene,
  camera,
  renderer,
  sceneObjects = [];

window.addEventListener('load', init);

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  sceneObjects.push(createGradientMeshToPosition(0xf9826c, 0x0096ea, new THREE.SphereGeometry(10, 50, 50), 0));

  sceneObjects.forEach(object => {
    scene.add(object);
  });

  animationLoop(camera);

  onWindowResize();
  window.addEventListener('resize', onWindowResize);
  document.getElementById('gradient_michael').appendChild(renderer.domElement);

}

function onWindowResize() {

  renderer.setSize(window.innerWidth/4, window.innerHeight/4);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

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

function createGradientMeshToPosition(colorAValue, colorBValue, geometry, position) {
  var myUniforms = {};
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
