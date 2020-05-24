import Body from './body.js'
import create from './create.js'
import {HEIGHT, WIDTH} from "./config.js";

export default class Line extends Body {
    constructor (x, y, width) {
        super(create('rect'))
        this.width = width * WIDTH
        this.height = 4
        this.x = x * WIDTH
        this.y = y * HEIGHT
        this.element.classList.add('line')

    }
}
