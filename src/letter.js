import { Mesh, ObjectLoader, Path, Scene, BoxGeometry, MeshStandardMaterial, MathUtils, LineBasicMaterial, Vector3, BufferGeometry, Line, DoubleSide, Color, MeshPhongMaterial } from 'three';
import jsonBlock from "./model.json" // gets parsed right away

// tutorials
// https://threejs.org/docs/#api/en/extras/core/Path
// https://observablehq.com/@rveciana/three-js-object-moving-object-along-path

export class Letter {

    path
    cubes
    scene
    loader
    baseColor
    cubeOffset

    // TODO ALLE CUBES IN CHILD CONTAINER, offset op de gehele container
    constructor(letterpoints, offset, scene, color) {
        this.scene = scene
        this.cubes = []
        this.loader = new ObjectLoader()
        this.baseColor = color
        let scale = 1
        
        // 2D path is needed to progress points along the path
        // somehow this path gets flipped ???
        letterpoints = letterpoints.map(p => [(p[0] + offset.x) * scale, (p[1] + offset.y) * scale])
        this.path = new Path()
        this.path.moveTo(letterpoints[0][0], letterpoints[0][1])
        for (let i = 1; i < letterpoints.length; i++) {
            this.path.lineTo(letterpoints[i][0], letterpoints[i][1])
        }

        // put starting blocks on the path
        this.fillPathWithBlocks()

        // show the whole path visually
        // this.drawPath()

        // start position
        this.updateCubes()
    }




    // shows the path in the scene
    drawPath() {
        const points = this.path.getPoints();
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: 0xffffff });
        const line = new Line(geometry, material);
        this.scene.add(line)
        line.position.z = -2   // line is flipped ????? suddenly -1 moves AWAY from the camera ?!?!?
    }

    fillPathWithBlocks() {
        // draw one block halfway this path
        // const test = path.getPoint(0.5) // 0 is start, 1 is end
        // bl.position.set(test.x, test.y)

        for (let i = 0; i < 70; i++) {
            // todo use DEEP CLONE so we dont need a loader in every letter
            // if you use obj.clone the inner colors still reference the same object
            let bl = this.loader.parse(jsonBlock) // only way to get an original object??
            
            // COLOR VARIATION
            // console.log(bl.children[0].material.color)
            const col = this.colorVariation(this.baseColor)
            //bl.children[0].material.color = col
            //bl.children[1].material.color = col

            // material should be PHONG to cast shadows
            const phongMaterial = new MeshPhongMaterial({ color: col });
            bl.children.forEach(child => {
                child.material = phongMaterial;
                child.castShadow = true;
            });

            // STARTPOINT ON THE PATH
            let progress = Math.random()
            let sc = (Math.random() * 0.07) + 0.03
            bl.scale.set(sc,sc,sc)
            bl.baseScale = sc
            this.scene.add(bl)
            // remember
            bl.myOffset = {
                x: Math.random() * 0.15,
                y: Math.random() * 0.15,
                z: Math.random() * 0.15,
            }
            bl.myProgress = progress
            bl.position.z = -2 // somewhow this is flipped ?!?
            // bl.castShadow = true;
            this.cubes.push(bl)
        }
    }

    // naar utils
    colorVariation(col) {
        const offset = 4 // higher offset means LESS variation
        const r = (col.r + Math.random() / offset) / 2
        const g = (col.g + Math.random() / offset) / 2
        const b = (col.b + Math.random() / offset) / 2
        return new Color(r, g, b);
    }

    // move cubes along the path
    // optional: use distance of the mouse to the center for extra scaling effect
    updateCubes() {
        for (let cube of this.cubes) {
            cube.myProgress += 0.002
            cube.myProgress = cube.myProgress % 1
            const p = this.path.getPoint(cube.myProgress) // 0 is start, 1 is end
            cube.position.set(p.x + cube.myOffset.x , p.y + cube.myOffset.y) // maybe add offset to each cube
        
            // shrink when at the start and beginning
            // works better if the letter paths have a longer start and end
            let sc = cube.baseScale
            let fraction = 0.15
            if(cube.myProgress < fraction) {
                sc *= (cube.myProgress * (1/fraction))
            }
            if (cube.myProgress > 1-fraction) {
                sc *= ((1 - cube.myProgress) * (1/fraction))
            }
            // extra mouse effect
            //let mouseEffect = this.clamp(1 - distance, 0, 0.2)
            //sc += mouseEffect

            cube.scale.set(sc, sc, sc)
        }
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max)
    }
}