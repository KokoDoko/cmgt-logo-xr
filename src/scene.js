import { Mesh, PlaneGeometry, MeshPhongMaterial, Scene, BoxGeometry, MeshStandardMaterial, MathUtils, Vector3, BufferGeometry, Line, DoubleSide, Color, Matrix4, Raycaster } from 'three';
import { Letter } from './letter.js';

export function createLogo(scene) {
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

    const magenta = new Color(1, 0, 0.41)
    const blue = new Color(33 / 255, 181 / 255, 222 / 255)
    const green = new Color(64 / 255, 209 / 255, 42 / 255)
    const purple = new Color(112 / 255, 42 / 255, 209 / 255)

    const letters = [
        new Letter(c, { x: -0.2, y: 1.6 }, scene, magenta),
        new Letter(m, { x: 0.2, y: 1.6 }, scene, blue),
        new Letter(g, { x: -1.2, y: 0.2 }, scene, green),
        new Letter(t, { x: 0.2, y: 0.2 }, scene, purple)
    ]
    
    return letters
}


export function addPlane(scene) {
    let col = new Color(0.05, 0.25, 0.05);
    // plane, facing THREE.FrontSide, BackSide, DoubleSide
    const geometry = new PlaneGeometry(40, 40, 8, 8)
    const material = new MeshPhongMaterial({ color: col, side: DoubleSide })
    const plane = new Mesh(geometry, material)

    plane.rotation.x = MathUtils.degToRad(90)
    plane.position.set(0, 0, 0)
    plane.receiveShadow = true;

    scene.add(plane)
}

// block at the spot of the VR goggles just for testing
export function gogglePlaceholder(scene) {
    const geometry = new BoxGeometry(0.1, 0.05, 0.05)
    const material = new MeshPhongMaterial({ color: 0x00ff00 })
    const fakegoggles = new Mesh(geometry, material)
    fakegoggles.position.set(0, 1.7, 0)
    scene.add(fakegoggles)
}