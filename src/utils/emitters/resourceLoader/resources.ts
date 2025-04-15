import { GLTFLoader, DRACOLoader, GLTF } from "three/examples/jsm/Addons.js";
import { TextureLoader, Texture } from "three";
import EventEmitter from "../../eventEmitter";
import sources from "./data/sources";
import ModelInfo from "./data/type";
// import Experience from "../../../experience/experience";

type ResourceFile = GLTF | Texture

interface ResourceDictionary {
    [name: string]: ResourceFile
}

class Resources extends EventEmitter {
    public items: ResourceDictionary = {}
    // private experience: Experience 
    private sources: ModelInfo[] = sources
    private dracoLoader: DRACOLoader = new DRACOLoader()
    private gltfLoader: GLTFLoader 
    private textureLoader: TextureLoader = new TextureLoader()
    private toLoad: number = this.sources.length
    private loaded: number = 0

    


    constructor() {
        super()
        // this.experience = Experience.getInstance()
        this.gltfLoader = new GLTFLoader()
        this.init()
    }

    private init(): void {
        this.dracoLoader.setDecoderPath('models/draco/')
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
        

        this.startLoading()

    }

    private async startLoading () {
        const loadPromises = this.sources.map((source) => this.loadResource(source))

        await Promise.all(loadPromises)

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }

    }

    private async loadResource (source: ModelInfo) {
        let loader: GLTFLoader | TextureLoader
        let file: ResourceFile

        switch(source.type) {
            case 'gltfModel':
                loader = this.gltfLoader
                break
            
            case 'texture':
                loader = this.textureLoader
                break
            
            default:
                console.warn(`unknown resource type: ${source.type}`)
        }

        try {
            file = await loader!.loadAsync(source.path)
            this.sourceLoaded(source, file)
        } catch (error) {
            console.error(`Error loading ${source.name}:`, error)
        } finally {
            // console.log('done')
        }
    }

    private sourceLoaded (source: ModelInfo, file: ResourceFile): void {
        this.items[source.name] = file
        this.loaded++
        console.log(file)

    }
}

export default Resources