import Body from './body.js'
import create from './create.js'
import {HEIGHT, WIDTH} from "./config.js";

export default class Goal extends Body {
  constructor (x, y) {
    super(create('svg'))
    this.element.innerHTML = `
    <svg width="24" height="18">
    <path d="M4 16v2h12v-2h2v-2h2v-2h2v-2h2v-2h-6v2h-2v-2h-2v-2h-10v2h-4v6h2v2zM2 10h2v2h-2v-2zM10 10h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
    <path d="M6 2h2v-2h2v2h2v2h-6z"/>
    </svg>`
    this.width = 24
    this.height = 18
    this.load(x, y)
  }

  load (x, y) {
    this.x = x * WIDTH +3
    this.y = y * HEIGHT +12
  }

  toJSON () {
    return [Math.round(this.x), Math.round(this.y)]
  }
}
