import Body from './body.js'
import create from './create.js'
import {HEIGHT, WIDTH} from "./config.js";

export default class Ladder extends Body {
    constructor (x, y, width, height) {
        super(create('rect'))
        this.width = width * WIDTH
        this.height = height * HEIGHT
        this.x = x * WIDTH
        this.y = y * HEIGHT
        this.on = true
        this.element.classList.add('ladder')
    }

    get on () {
        return !!this._on
    }

    set on (value) {
        this._on = !!value
        this.element.classList.toggle('light', this.on)
        this.element.classList.toggle('dark', !this.on)
    }

    toJSON () {
        return [
            Math.round(this.x),
            Math.round(this.y),
            Math.round(this.width),
            Math.round(this.height),
            Number(this.on)
        ]
    }

    // overlaps (other) {
    //     return this.left < other.right &&
    //         this.right > other.left &&
    //         this.top < other.bottom &&
    //         this.bottom > other.top
    // }
}
