import * as THREE from "./three.module.js"

window.addEventListener('load', init)
let scene
let camera
let renderer
let sceneObjects = []
let uniforms = {}

function init() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)
  addLightningToScene(scene)
  addBasicCube()
  addCubeWithVertexAndFragmentShader(1, 1, 3)
  addCubeWithVertexAndFragmentShader(3, 1, 1)
  addCubeWithVertexAndFragmentShader(1, 3, 1)
  // addExperimentalLightCube()
  animationLoop()

}

function addLightningToScene(scene) {
  let pointLight = new THREE.PointLight(0x3a2c11)
  pointLight.position.set(0, 0, 0)
  scene.add(pointLight)

  let ambientLight = new THREE.AmbientLight(0x505050)
  scene.add(ambientLight)
}

function addPointLightToPosition(x, y, z) {
  let pointLight = new THREE.PointLight(0x3a2c11)
  pointLight.position.set(x, y, z)
  scene.add(pointLight)
}

function addBasicCube() {
  let geometry = new THREE.BoxGeometry(1, 1, 1)
  let material = new THREE.MeshLambertMaterial()

  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = -2
  scene.add(mesh)
  sceneObjects.push(mesh)
}

function vertexShader() {
  return `
    varying vec3 vUv; 
    varying vec4 modelViewPosition; 
    varying vec3 vecNormal;

    void main() {
      vUv = position; 
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz; //????????
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
  return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
  `
}

function addCubeWithVertexAndFragmentShader(xLength, yLength, zLength) {
  uniforms.colorA = { type: 'vec3', value: new THREE.Color(0xf9826c) }
  uniforms.colorB = { type: 'vec3', value: new THREE.Color(0xACB6E5) }

  let geometry = new THREE.BoxGeometry(xLength, yLength, zLength)
  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  })

  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = 2
  scene.add(mesh)
  sceneObjects.push(mesh)
}

function animationLoop() {
  renderer.render(scene, camera)

  for (let object of sceneObjects) {
    // smaller values make it rotate slower on the x / y axis
    object.rotation.x += 0.0055
    object.rotation.y += 0.0003
  }

  requestAnimationFrame(animationLoop)
}
