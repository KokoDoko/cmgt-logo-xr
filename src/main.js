import './style.css'
import { Mesh, PlaneGeometry, MeshPhongMaterial, Scene, BoxGeometry, PerspectiveCamera, WebGLRenderer, MathUtils, Vector3, BufferGeometry, Line, DoubleSide, Color, AmbientLight, Raycaster, SpotLight, PCFShadowMap } from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

import { addPlane, createLogo, gogglePlaceholder } from './scene.js'

let scene, camera, renderer, controls, controllers, letters

class App {

    constructor() {
        this.scene = new Scene()
        let darkgreen = new Color("rgb(5,22,5)")
        let skyblue = new Color(0.08, 0.08, 0.26)
        this.scene.background = darkgreen;
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.y = 1.7
        this.camera.position.z = 0.4

        this.renderer = new WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.xr.enabled = true;                 // VR TRUE !!!
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFShadowMap;

        const light = new AmbientLight(0x404040, 3) // soft white light
        this.scene.add(light)

        const spotLight = new SpotLight(0xffffff, 7)
        spotLight.position.set(0, 4.4, 0.5) // flipped for some reason
        spotLight.target.position.set(0, 0, 0)
        spotLight.castShadow = true;
        this.scene.add(spotLight)

        // orbit controls - werkt niet met VR - alleen om snel even een scene te testen
        // controls = new OrbitControls(camera, renderer.domElement)

        addPlane(this.scene)
        //gogglePlaceholder(this.scene)
        this.letters = createLogo(this.scene)

        // XR controllers
        this.controllers = this.buildControllers()

        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));
        //document.body.appendChild(ARButton.createButton(renderer));
        this.renderer.setAnimationLoop((time) => this.gameloop(time))
    }

    gameloop(time) {
        for (let l of this.letters) {
            l.updateCubes()
        }
        this.renderer.render(this.scene, this.camera)
    }


    buildControllers() {
        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new BufferGeometry().setFromPoints([
            new Vector3(0, 0, 0),
            new Vector3(0, 0, -1)
        ]);

        const line = new Line(geometry);
        line.scale.z = 10;

        const controllers = [];

        for (let i = 0; i < 2; i++) {
            const controller = this.renderer.xr.getController(i);
            controller.add(line.clone());
            controller.userData.selectPressed = false;
            controller.userData.selectPressedPrev = false;
            this.scene.add(controller);
            controllers.push(controller);

            const grip = this.renderer.xr.getControllerGrip(i);
            grip.add(controllerModelFactory.createControllerModel(grip));
            this.scene.add(grip);
            
            controller.addEventListener('selectstart', (ev) => this.onSelectStart(ev))
            controller.addEventListener('selectend', (ev) => this.onSelectEnd(ev))

            controller.addEventListener('squeezestart', (ev) => this.onSqueezeStart(ev))
            controller.addEventListener('squeezeend', (ev) => this.onSqueezeEnd(ev))
        }

        return controllers;
    }

    // TODO MOVE CONTROLLER LOGIC TO SEPARATE CLASS

    onSelectStart(ev) {
        console.log("SELECT START")
        console.log(ev.target)
    }

    onSelectEnd(ev) {
        console.log("SELECT END")
    }

    onSqueezeStart(ev) {
        console.log("SQUEEZE START")
        console.log(ev.target)
    }

    onSqueezeEnd(ev) {
        console.log("SQUEEZE END")
    }

}

new App()