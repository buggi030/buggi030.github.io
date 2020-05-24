import Body from './body.js'
import create from './create.js'
import {HEIGHT, WIDTH} from "./config.js";

export default class Bar extends Body {
  constructor (x, y, width, height, isStable) {
    super(create('rect'))
    this.width = width * WIDTH
    this.height = height * HEIGHT
    this.x = x * WIDTH
    this.y = y * HEIGHT
    this.on = true
    this.stable = isStable
  }

  get on () {
    return !!this._on
  }

  set on (value) {
    this._on = !!value
    // this.element.classList.add('wall')
    this.element.classList.toggle('light', this.on)
    this.element.classList.toggle('dark', !this.on)
  }

  get stable () {
    return !!this._stable
  }

  set stable (value) {
    this._stable = !!value
    this.element.classList.toggle('wall', this.stable)
    this.element.classList.toggle('grass', !this.stable)
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

  tick() {
    new Promise((resolve, reject) => {
      let start = performance.now()
      requestAnimationFrame(function check (now) {
        if (now >= start + 6000) return resolve()
        requestAnimationFrame(check)
      })
    }).then(() => {
      this.on = true
    })
  }
}
