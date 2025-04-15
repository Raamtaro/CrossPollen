import { PerspectiveCamera, Group } from "three";
import Experience from "./experience";
import Sizes from "../utils/emitters/sizes";

// import { OrbitControls } from "three/examples/jsm/Addons.js";
import TimeKeeper from "../utils/emitters/timeKeeper";


/**
 * COMMENTED LINES IMPLEMENT ORBIT CONTROLS
 */

class Camera {
    private experience: Experience 
    protected time: TimeKeeper
    protected size: Sizes 
    // private controls: OrbitControls
    // private canvas: HTMLCanvasElement
    public instance: PerspectiveCamera 
    public group: Group
    

    constructor() {
        this.experience = Experience.getInstance()
        // this.canvas = this.experience.canvas
        this.size = this.experience.size as Sizes
        this.time = this.experience.time
        this.instance = new PerspectiveCamera(35, this.size.aspectRatio, 0.1, 2000)
        this.group = new Group()

        // this.controls = new OrbitControls(this.instance, this.canvas)
        
        this.init()
        this.size.on('resize', this.onResize.bind(this))
        // this.time.on('tick', this.onUpdate.bind(this))
     
    }

    private init(): void {
        this.instance.position.set(0, 0, 4.375)
        this.instance.lookAt(0, 0, 0)

        this.group.add(this.instance)
        // this.setupControls()

    }

    // private setupControls(): void {
    //     this.controls.enableDamping = true
    // }

    // private onUpdate(): void {
    //     this.controls.update()
    // }


    private onResize(): void {
        this.instance.aspect = this.size.aspectRatio
        this.instance.updateProjectionMatrix()
    }
}

export default Camera