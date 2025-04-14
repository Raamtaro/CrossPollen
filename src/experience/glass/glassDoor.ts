import * as THREE from 'three'

import {Mesh, ShaderMaterial} from 'three'

import Experience from "../experience";
import TimeKeeper from '../../utils/emitters/timeKeeper';
import Sizes from '../../utils/emitters/sizes';
import Mouse from '../../utils/mouse';

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import Renderer from '../renderer';


class GlassDoor {
    private experience: Experience
    private renderer: Renderer
    private dimensions: Sizes
    private time: TimeKeeper
    private mouse: Mouse
    private geometry: THREE.PlaneGeometry | THREE.TorusGeometry
    private material: ShaderMaterial 
    private baseScale: boolean | null = null

    private fbo: THREE.WebGLRenderTarget
    

    public instance: Mesh


    constructor(config: number = 1) {
        this.experience = Experience.getInstance()
        
        this.dimensions = this.experience.size
        this.time = this.experience.time
        this.mouse = this.experience.mouse

        this.renderer = this.experience.renderer


        this.geometry = new THREE.PlaneGeometry(7.5, 7.5) //Config #1
        this.material = new ShaderMaterial(
            {
                uniforms: {
                    uResolution: new THREE.Uniform(new THREE.Vector2(this.dimensions.width * this.dimensions.pixelRatio, this.dimensions.height * this.dimensions.pixelRatio)),
                    uTime: new THREE.Uniform(0.0),
                    uTargetTexture: new THREE.Uniform(null),

                    uIorR: new THREE.Uniform(1.06),
                    uIorG: new THREE.Uniform(1.05),
                    uIorB: new THREE.Uniform(1.04),
                    uIorY: new THREE.Uniform(1.07),
                    uIorC: new THREE.Uniform(1.03),
                    uIorP: new THREE.Uniform(1.08),

                    uChromaticAberration: new THREE.Uniform(.77),
                    uRefractPower: new THREE.Uniform(0.93),
                    uSaturation: new THREE.Uniform(1.07),

                    uShininess: new THREE.Uniform(40),
                    uDiffuseness: new THREE.Uniform(0.27),
                    uLight: new THREE.Uniform(new THREE.Vector3(-1.0, 1.0, 1.0)),
                    uFresnelPower: new THREE.Uniform(4.7),
                },  
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            }
        )

        this.instance = new Mesh(this.geometry, this.material)
        this.instance.position.set(0, 0, 3.5)

        this.fbo = new THREE.WebGLRenderTarget(this.dimensions.width * this.dimensions.pixelRatio, this.dimensions.height * this.dimensions.pixelRatio, 
            {
                type: THREE.FloatType
            }
        )
        

        this.init()
        this.dimensions.on('resize', this.onResize.bind(this))
        this.time.on('tick', this.update.bind(this))
        
    }

    private init(): void {
        this.configSize()
        this.experience.scene.add(this.instance)
    }

    private configSize(): void {
        // this.instance.rotateX(Math.PI / 2)


        if (this.dimensions.width <= 1000) {
            this.instance.scale.set(.10, .10, .10)
            this.baseScale = false
        } 
        else {
            this.instance.scale.set(0.195, 0.195, 0.195) //1000 and above
            this.baseScale = true //This means that we are scaling for 1000+
        }
    }

    private onResize(): void {
        this.scaleResize()
        this.targetResize()
    }

    private scaleResize(): void {
        (this.instance.material as ShaderMaterial).uniforms.uResolution.value = new THREE.Vector2(this.dimensions.width * this.dimensions.pixelRatio, this.dimensions.height * this.dimensions.pixelRatio)

        if (this.dimensions.width <= 1000) { //Will get caught if we resize to 1000 or under
            if (this.baseScale && !(this.instance === null)) { //Checking to see what the baseScale is set at
                this.instance.scale.set(.10, .10, .10)
                this.baseScale = false //This means that we are viewing with a smaller screen
            }
            return //If it reaches here, then this.baseScale was already false, and there's no action needs
        }

        //Will pass the above check as long as we resize to above 1000

        if (!this.baseScale && !(this.instance === null)) { //Is the screen small?
            this.instance.scale.set(.195, .195, .195)
            this.baseScale = true
        }
        return
    }

    private targetResize(): void {
        this.fbo.setSize(this.dimensions.width * this.dimensions.pixelRatio, this.dimensions.height * this.dimensions.pixelRatio)
    }

    private swapAndRenderTarget(): void {
        this.instance.visible = false

        this.renderer.instance.setRenderTarget(this.fbo as THREE.WebGLRenderTarget);
        this.renderer.instance.render(this.experience.scene, this.experience.camera.instance);
        
        (this.instance.material as ShaderMaterial).uniforms.uTargetTexture.value = this.fbo.texture;
        (this.instance.material as ShaderMaterial).uniforms.uTargetTexture.value.needsUpdate = true;

        this.renderer.instance.setRenderTarget(null)
        this.instance.visible = true
    }

    private update(): void {
        (this.instance.material as ShaderMaterial).uniforms.uTime.value = this.time.uniformElapsed
        this.instance.rotation.x = -.23 * this.mouse.coords_trail.y;
        this.instance.rotation.y = .23 * this.mouse.coords_trail.x;
        // this.instance.rotation.x += 0.001
        // this.instance.rotation.y += 0.001
        // this.instance.position.y = .195 * Math.sin(this.time.uniformElapsed * 0.13);

        

        this.swapAndRenderTarget()
    }
}

export default GlassDoor