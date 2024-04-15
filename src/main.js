import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { Letter } from './letter.js';

//const loader = new THREE.ObjectLoader()
let scene, camera, renderer, controls
let letters = []

function init() {
    scene = new THREE.Scene()
    let darkgreen = new THREE.Color("rgb(5,22,5)")
    let skyblue = new THREE.Color(0.08, 0.08, 0.26)
    scene.background = darkgreen;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.y = 1.7
    camera.position.z = 0.4

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true;                 // VR TRUE !!!

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    const light = new THREE.AmbientLight(0x404040, 3) // soft white light
    scene.add(light) 
    

    const spotLight = new THREE.SpotLight(0xffffff, 7) 
    spotLight.position.set(0, 4.4, 0.5) // flipped for some reason
    spotLight.target.position.set(0, 0, 0)
    scene.add(spotLight)

    // only for spotlight and pointlight
    spotLight.castShadow = true;

    // orbit controls 
    // controls = new OrbitControls(camera, renderer.domElement)

    addPlane()
    //gogglePlaceholder()
    createLogo()

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    //document.body.appendChild(ARButton.createButton(renderer));
    renderer.setAnimationLoop(gameloop)    // this is specific for XR but also works in normal mode...?


    // xr controller
    /*
    const controller = renderer.xr.getController(0);
    controller.addEventListener('connected', (e) => {
        controller.gamepad = e.data.gamepad
        console.log("xr controller 0 connected")
    })
    */
}

function gameloop(time) {
    for (let l of letters) {
        l.updateCubes()
    }
    renderer.render(scene, camera)
}



function createLogo() {
    // basic letter shapes
    /*
    const c = [[0,0], [-1,0], [-1,1], [0,1]]
    const m = [[0, 0], [0, 1], [0.5,0.5], [1,1], [1,0]]
    const g = [[0.5,0.5], [1,0.5],[1,0],[0,0],[0,1],[1,1]]
    const t = [[0.5, 0], [0.5,1], [0,1], [1,1]]
    */

    // variation with longer start and end for scaling animation
    const c = [[0.15, 0], [-1, 0], [-1, 1], [0.15, 1]]
    const m = [[0, -0.15], [0, 1], [0.5, 0.5], [1, 1], [1, -0.15]]
    const g = [[0.25, 0.5], [1, 0.5], [1, 0], [0, 0], [0, 1], [1.15, 1]]
    const t = [[0.5, -0.2], [0.5, 1], [0, 1], [1.2, 1]]

    const magenta = new THREE.Color(1, 0, 0.41)
    const blue = new THREE.Color(33 / 255, 181 / 255, 222 / 255)
    const green = new THREE.Color(64 / 255, 209 / 255, 42 / 255)
    const purple = new THREE.Color(112 / 255, 42 / 255, 209 / 255)

    letters = [
        new Letter(c, { x: -0.2, y: 1.6 }, scene, magenta),
        new Letter(m, { x: 0.2, y: 1.6 }, scene, blue),
        new Letter(g, { x: -1.2, y: 0.2 }, scene, green),
        new Letter(t, { x: 0.2, y: 0.2 }, scene, purple)
    ]
}


function addPlane() {
    let col = new THREE.Color(0.05, 0.25, 0.05);
    // plane, facing THREE.FrontSide, BackSide, DoubleSide
    const geometry = new THREE.PlaneGeometry(40, 40, 8, 8)
    const material = new THREE.MeshPhongMaterial({ color: col, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(geometry, material)
    
    plane.rotation.x = THREE.MathUtils.degToRad(90)
    plane.position.set(0,0,0)
    plane.receiveShadow = true;
    
    scene.add(plane)
}

// block at the spot of the VR goggles just for testing
function gogglePlaceholder() {
    const geometry = new THREE.BoxGeometry(0.1, 0.05, 0.05)
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    const fakegoggles = new THREE.Mesh(geometry, material)
    fakegoggles.position.set(0, 1.7, 0)
    scene.add(fakegoggles)
    fakegoggles.castShadow = true;
}

init()