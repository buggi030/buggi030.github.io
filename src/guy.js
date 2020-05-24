import {leftKey, rightKey} from './keys.js'
import Body from './body.js'
import create from './create.js'
import {SPEED, WIDTH, HEIGHT, BOX_HEIGHT, BOX_WIDTH} from "./config.js";
import sleep from "./sleep.js";
import {downKey, upKey} from "./keys.js";

export default class Guy extends Body {
    constructor(x, y) {
        super(create('svg'))
        this.element.innerHTML = `
    <svg id="guy" fill-rule="evenodd">
    <path id="head" d="M10 12v-6h2v-2h8v4h2v2h-2v2zM16 6h2v2h-2v-2zm-2 4h4v2h-4v-2z"/>
    <path id="right-hand" d="M18 12h2v2h4v2h2v2h2v4h-4v-2h-6z"/>
    <path id="left-hand" d="M10 12h-2v2h-2v2h-2v6h2v-2h2v-2h2z" />
    <path id="foots" d="M22 20v2h2v6h2v2h-6v-2h-2v-2h-2v2h-2v2h-2v2h-6v-2h2v-6h2v-4z" />
        <path d="M10 12h10v8h-10z" />

     </svg>`
        this.load(x, y)
        this.height = HEIGHT
        this.width = WIDTH
        this.walking = false
        this.speed = SPEED
        this.vx = 0
        this.vy = 0
        this.element.classList.add('stay')

    }

    tick(scale, bounds) {

        if (this.x % WIDTH === 0 && this.y % HEIGHT === 0) {
            this.walking = false
            this.vy = this.gravity(scale, bounds) ? this.gravity(scale, bounds) : (this.testDown(scale, bounds) + this.testUp(scale, bounds))
            this.vx = this.testLeft(scale, bounds) + this.testRight(scale, bounds)
        }
        // this.vy = this.testDown(scale, bounds) + this.testUp(scale, bounds)
        const dx = Math.min(bounds.right, Math.max(bounds.left, this.vx)),
            dy = Math.min(bounds.bottom, Math.max(bounds.top, this.vy));

        if (dy && (this.y + Math.sign(dy) * HEIGHT < BOX_HEIGHT)) {
            this.walking = true
            this.y += dy
        } else if (dx && (this.x + Math.sign(dx) * WIDTH < BOX_WIDTH)) {
            this.walking = true
            this.moveFace(dx)
            this.x += dx
        }
    }

    moveFace(dx) {
        this.faceLeft = dx < 0
        this.faceRight = dx > 0
    }

    get faceLeft() {
        return !!this._faceLeft
    }

    set faceLeft(value) {
        this._faceLeft = !!value
        this.element.classList.toggle('left', this.faceLeft)
    }

    get faceRight() {
        return !!this._faceRight
    }

    set faceRight(value) {
        this._faceRight = !!value
        this.element.classList.toggle('right', this.faceRight)
    }

    get walking() {
        return !!this._walking
    }

    set walking(value) {
        this._walking = !!value
        this.element.classList.toggle('walk', this.walking)
    }

    load(x, y) {
        this.x = x * WIDTH
        this.y = y * HEIGHT
    }

    toGoal() {
        return {x: this.x, y: this.y}
    }

    set vy(value) {
        this.inFall = !!value
        this._vy = value
    }

    get vy() {
        return this._vy
    }

    testUp(scale, bounds) {
        if (upKey()) {
            if (bounds.onLadder) {
                return -scale(this.speed)
            }
        }
        return 0;
    }

    testDown(scale, bounds) {
        if (downKey()) {
            if (bounds.onLadder || bounds.onTopLadder || bounds.underLine) {
                return scale(this.speed)
            }
        }
        return 0;
    }

    testLeft(scale, bounds) {
        if (leftKey()) {
            return -scale(this.speed)
        }
        return 0;
    }

    testRight(scale, bounds) {
        if (rightKey()) {
            return scale(this.speed)
        }
        return 0;
    }

    gravity(scale, bounds) {

        if (bounds.bottom && !bounds.onLadder && !bounds.onTopLadder && !bounds.underLine) {
            return scale(SPEED)
        }
        return 0
    }

    async death() {
        // DEATH_FX.play()
        const death = document.getElementById('death')
        death.setAttribute('x', this.x - 32 + this.width / 2)
        death.setAttribute('y', this.y - 32 + this.height / 2)
        this.element.setAttribute('hidden', true)
        document.body.classList.add('dying')
        await sleep(700)
        document.body.classList.remove('dying')
    }
}
