import { Vector2 } from "three"
import Experience from "../experience/experience"
import Sizes from "./emitters/sizes"
import TimeKeeper from "./emitters/timeKeeper"

class Mouse {
    private experience: Experience
    private size: Sizes
    private time: TimeKeeper
    private coords: Vector2
    private coords01: Vector2
    private coords_old: Vector2
    private velocity: number = 0.0
    private ease: number = 0.0125

    public coords_trail: Vector2
    public coords_trail01: Vector2
    public targetVelocity: number = 0.0
    
    

    constructor() {

        this.experience = Experience.getInstance()
        this.size = this.experience.size
        this.time = this.experience.time

        this.coords = new Vector2()
        this.coords01 = new Vector2()
        this.coords_old = new Vector2()
        this.coords_trail = new Vector2()
        this.coords_trail01 = new Vector2()

        this.setupListeners()
        this.time.on('tick', this.update.bind(this))
    }

    

    private setupListeners(): void {
        document.body.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
        document.body.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );
        document.body.addEventListener( 'touchmove', this.onDocumentTouchMove.bind(this), false );
    }

    private setCoords( x: number, y: number) {
        this.coords.set( (x / this.size.width) * 2 - 1, - (y / this.size.height) * 2 + 1)

        this.coords01.set( x / this.size.width, 1 - y / this.size.height );
    }

    private onDocumentMouseMove( event: MouseEvent): void {
        this.setCoords( event.clientX, event.clientY );
        
    }

    private onDocumentTouchStart( event: TouchEvent): void {
        if ( event.touches.length === 1 ) {
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    private onDocumentTouchMove( event: TouchEvent): void {
        if ( event.touches.length === 1 ) {
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    private update(): void {
        //Velocity is functioning nominally.
        this.velocity = Math.sqrt( (this.coords_old.x - this.coords.x)**2 + (this.coords_old.y - this.coords.y)**2)
        this.targetVelocity -= this.ease * (this.targetVelocity - this.velocity)

        //NDC Coords for general mouse effects
        this.coords_trail.lerp(this.coords, this.ease)
        this.coords_trail01.lerp(this.coords01, this.ease)
        this.coords_old.copy(this.coords);

        // console.log(this.coords_trail)

        // if (this.targetVelocity) {
        //     console.log(this.targetVelocity)
        // }
    }
}

export default Mouse