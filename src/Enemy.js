import Guy from "./guy.js";
import {BOX_HEIGHT, BOX_WIDTH, HEIGHT, WIDTH, SPEED} from "./config.js";

export default class Enemy extends Guy {
    constructor(x, y, name) {
        super(x, y)
        this.element.innerHTML = `
        <svg id="enemy">
            <g id="inner-guy">
                <rect class="${name}" x="0" y="14" width="30" height="14"/>
                <rect id="left_foot" class="accent" x="4" y="28" width="6" height="4"/>
                <rect id="right_foot" class="accent" x="24" y="28" width="6" height="4"/>
                <g id="head">
                    <rect class="accent" x="0" y="0" width="32" height="14"/>
                    <rect id="face" x="4" y="2" width="26" height="10"/>
                    <rect class="accent" x="9" y="7" width="4" height="4"/>
                    <rect class="accent" x="24" y="7" width="4" height="4"/>
                </g>
            </g>
        </svg>`
        this._goal = {x: 608, y: this.y}
        this.speed = SPEED /2
        this.name = name
    }

    set goal(value) {
        this._goal = value
    }

    get goal() {
        return this._goal
    }

    tick(scale, bounds, guy) {
        if (this.x % WIDTH === 0 && this.y % HEIGHT === 0 && !this.gravity(scale, bounds)) {
            this.goal = guy.toGoal()
            this.vx = 0
            this.vy = 0
            this.walking = false

            const diffX = guy.x - this.x,
                diffY = guy.y - this.y;

            let vx = 0, vy = 0;

            if (diffX < 0) {
                vx = this.testLeft(scale, bounds)
            } else if (diffX > 0) {
                vx = this.testRight(scale, bounds)
            }

            if (diffY < 0) {
                vy = this.testUp(scale, bounds)
            } else if (diffY > 0) {
                vy = this.testDown(scale, bounds)
            }

            this.vx = vx
            this.vy = vy
        }

        const gravity = this.gravity(scale, bounds);
        if (gravity && (this.y + Math.sign(gravity) * HEIGHT < BOX_HEIGHT)) {
            this.vy = gravity
            this.y += Math.min(bounds.bottom, Math.max(bounds.top, this.vy));
            return
        }

        const dx = Math.min(bounds.right, Math.max(bounds.left, this.vx)),
            dy = Math.min(bounds.bottom, Math.max(bounds.top, this.vy));


        if (this.name === 'xman') {
            if (dx && (this.x + Math.sign(dx) * WIDTH < BOX_WIDTH)) {
                this.walking = true
                this.moveFace(dx)
                this.x += dx
            } else if (dy && (this.y + Math.sign(dy) * HEIGHT < BOX_HEIGHT)) {
                this.walking = true
                this.y += dy
            }
        } else {
            if (dy && (this.y + Math.sign(dy) * HEIGHT < BOX_HEIGHT)) {
                this.walking = true
                this.y += dy
            } else if (dx && (this.x + Math.sign(dx) * WIDTH < BOX_WIDTH)) {
                this.walking = true
                this.moveFace(dx)
                this.x += dx
            }
        }

    }

    testUp(scale, bounds) {
        return !!bounds.onLadder ? -scale(this.speed) : false
    }

    testDown(scale, bounds) {
        return ((!!bounds.onLadder || !!bounds.onTopLadder || !!bounds.underLine) && !!bounds.bottom) ? scale(this.speed) : false
    }

    testLeft(scale, bounds) {
        return !!bounds.left ? -scale(this.speed) : false
    }

    testRight(scale, bounds) {
        return !!bounds.right ? scale(this.speed) : false
    }
}
