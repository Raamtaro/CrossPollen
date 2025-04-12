import * as THREE from 'three'

import { WebGLRenderer } from "three";
import Experience from "./experience";
import Sizes from "../utils/emitters/sizes";


class Renderer {
    private experience: Experience 
    public canvas: HTMLCanvasElement 
    protected size: Sizes 
    public instance: WebGLRenderer 


    constructor () {
        this.experience = Experience.getInstance()
        this.canvas = this.experience.canvas
        this.size = this.experience.size 
        this.instance = new WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true,
                

            }
        )
        this.init()
        this.size.on('resize', this.resize.bind(this))
    }

    private init() {
        this.instance.setSize(this.size.width, this.size.height)
        this.instance.setPixelRatio(this.size.pixelRatio)
        this.instance.outputColorSpace = THREE.SRGBColorSpace

        this.instance.setClearColor('#f0ead6')
        //'#ebebeb'
    }

    public resize() {
        this.instance.setSize(this.size.width, this.size.height)
        this.instance.setPixelRatio(this.size.pixelRatio)

    }
}

export default Renderer