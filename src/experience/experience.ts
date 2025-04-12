import * as THREE from 'three'

import Sizes from '../utils/emitters/sizes';
import TimeKeeper from '../utils/emitters/timeKeeper';
import Mouse from '../utils/mouse.ts';


import Renderer from './renderer.ts';
import Camera from './camera.ts';

// import HelloWorld from './helloWorld/helloWorld.ts';
import ParticleSphere from './particles/main/particleSphere.ts';
import GlassDoor from './glass/glassDoor.ts';




declare global {
    interface Window {
      experience: Experience;
    }
}

// interface SceneObject {
//     scene: Scene,
//     target?: WebGLRenderTarget
// }

class Experience {

    private static instance: Experience | null = null

    public canvas: HTMLCanvasElement
    public size: Sizes 
    public time: TimeKeeper
    public renderer: Renderer 
    public camera: Camera
    public mouse: Mouse
    public scene: THREE.Scene
    // public helloWorld: HelloWorld
    public particleSphere: ParticleSphere
    public glassDoor: GlassDoor

    // private rendererables: (Points | Mesh)[] = []
    // private scenes: SceneObject[] = []

    constructor() {

        Experience.instance = this

        this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
        this.size = new Sizes()
        this.time = new TimeKeeper()
        this.mouse = new Mouse()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.scene = new THREE.Scene()

        // this.helloWorld = new HelloWorld()
        this.particleSphere = new ParticleSphere()
        this.glassDoor = new GlassDoor()

        this.time.on('tick', this.render.bind(this)) 
    }


    public static getInstance(): Experience {
        if (!Experience.instance) {
            Experience.instance = new Experience()

        }

        return Experience.instance
    }


    private render(): void {
        this.renderer.instance.render(this.scene, this.camera.instance)

    }
}

export default Experience