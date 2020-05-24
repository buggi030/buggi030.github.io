import Body from "./body.js";
import Counter from "./counter.js";
import Guy from "./guy.js";
import Goal from "./goal.js";
import levels from "./levels2.js";
import Bar from "./bar.js";
import sleep from "./sleep.js";
import {DEBUG, BOX_HEIGHT, BOX_WIDTH, HEIGHT, WIDTH} from "./config.js";
import {leftShootKey, rightShootKey, giveUpKey} from "./keys.js";
import Ladder from "./Ladder.js";
import Line from "./Line.js";
import create from "./create.js";
import Enemy from "./Enemy.js";

export default class Scene extends Body {
    constructor(game, levels) {
        super(document.getElementById('game'))
        // this.element.addEventListener('mousemove', this.mousemove.bind(this.element))
        this.deaths = new Counter(document.getElementById('death-counter'))
        this.stars = new Counter(document.getElementById('level-counter'))
        this.congrats = new Body(document.getElementById('congrats'))
        this.esc = new Body(document.getElementById('esc'))
        this.game = game
        this.levels = levels
        this.bars = []
        this.ladders = []
        this.lines = []
        this.paused = false
        this.guy = new Guy
        this.enemies = []
        this.append(this.guy)
        this.goals = []
        this.index = 0
    }

    get fromURL() {
        return !!this._fromURL
    }

    set fromURL(value) {
        this._fromURL = !!value
        this.esc.hidden = !this.fromURL
    }

    keydown({key}) {
        switch (key) {
            case 'Enter':
                if (this.finished) {
                    this.fromURL = false
                    this.levels = levels
                    this.game.state = 'title'
                    // playMusic()
                }
                break
            case 'Escape':
                if (this.fromURL) {
                    this.fromURL = false
                    this.levels = levels
                    this.game.state = 'title'
                    // playMusic()
                }
                break
        }
    }

    get on() {
        return this._on
    }

    set on(value) {
        this._on = value
        document.body.classList.toggle('on', value)
        document.body.classList.toggle('off', !value)
    }

    get index() {
        return this._index
    }

    set index(value) {
        this._index = Math.min(this.levels.length, Math.max(value || 0))

        this.on = true
        this.stars.value = this.index
        while (this.goals.length) this.goals.pop().remove()
        while (this.bars.length) this.bars.pop().remove()
        while (this.ladders.length) this.ladders.pop().remove()
        while (this.lines.length) this.lines.pop().remove()
        while (this.enemies.length) this.enemies.pop().remove()

        this.loadNet(DEBUG)

        if (this.finished) {
            this.guy.hidden = true
            this.congrats.hidden = false
            // playWin()
            return
        }

        this.guy.load(...this.level.get('guy'))
        this.guy.hidden = false
        this.congrats.hidden = true

        for (const values of this.level.get('enemies')) {
            const enemy = new Enemy(...values)
            this.prepend(enemy)
            this.enemies.push(enemy)
        }

        for (const values of this.level.get('goals')) {
            const goal = new Goal(...values)
            this.prepend(goal)
            this.goals.push(goal)
        }

        for (const values of this.level.get('bars')) {
            const [x1, y1, len, wid] = [...values]
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < wid; j++) {
                    const bar = new Bar(x1 + i, y1 + j, 1, 1, true)
                    this.prepend(bar)
                    this.bars.push(bar)
                }
            }
        }
        for (const values of this.level.get('grass')) {
            const [x1, y1, len, wid] = [...values]
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < wid; j++) {
                    const bar = new Bar(x1 + i, y1 + j, 1, 1, false)
                    this.prepend(bar)
                    this.bars.push(bar)
                }
            }
        }

        for (const values of this.level.get('ladders')) {
            const ladder = new Ladder(...values)
            this.prepend(ladder)
            this.ladders.push(ladder)
        }

        for (const values of this.level.get('lines')) {
            const line = new Line(...values)
            this.prepend(line)
            this.lines.push(line)
        }

    }

    get level() {
        return this.levels[this.index]
    }

    get finished() {
        return this.index >= this.levels.length
    }

    async advance() {
        // GOAL_FX.play()
        this.paused = true
        // document.body.classList.add('finish')
        // await sleep(1000)
        this.index += 1
        // document.body.classList.remove('finish')
        // await sleep(1000)
        if (this.finished) {
            // this.goal.hidden = true
        } else {
            this.paused = false
        }
        this.reset()
    }

    async death(guy) {
        // DEATH_FX.play()
        this.deaths.value += 1
        this.paused = true
        await guy.death()
        // const death = document.getElementById('death')
        // death.setAttribute('x', this.guy.x - 32 + this.guy.width / 2)
        // death.setAttribute('y', this.guy.y - 32 + this.guy.height / 2)
        // this.guy.element.setAttribute('hidden', true)
        // document.body.classList.add('dying')
        // await sleep(700)
        // document.body.classList.remove('dying')
        if (this.guy === guy) {
            this.reset()
            this.guy.element.removeAttribute('hidden')
            this.paused = false
        }
    }

    reset() {
        this.guy.load(...this.level.get('guy'))
    }

    lost(body) {
        return this.bars.some((bar) =>
            bar.on === this.on && bar.overlaps(body)
        )
        //     || this.guy.bottom > BOX_HEIGHT  || this.spikes.some((spike) =>
        //     spike.on === this.on && spike.overlaps(this.guy)
        // )
    }

    setBounds(body) {
        const {bounds} = body

        bounds.left = -body.left
        bounds.right = BOX_WIDTH - body.right
        bounds.top = -body.top
        bounds.bottom = BOX_HEIGHT - body.bottom
        bounds.onLadder = false
        bounds.underLine = false
        bounds.onTopLadder = false

        for (const bar of this.bars) {
            if (bar.on !== this.on) continue

            if (bar.top < body.bottom && bar.bottom > body.top) {
                if (bar.isRightOf(body)) {
                    bounds.right = Math.min(bounds.right, bar.left - body.right)
                } else if (bar.isLeftOf(body)) {
                    bounds.left = Math.max(bounds.left, bar.right - body.left)
                }
            }

            if (bar.left < body.right && bar.right > body.left) {
                if (bar.isBelow(body)) {
                    bounds.bottom = Math.min(bounds.bottom, bar.top - body.bottom)
                } else if (bar.isAbove(body)) {
                    bounds.top = Math.max(bounds.top, bar.bottom - body.top)
                }
            }
        }

        for (const ladder of this.ladders) {
            if (body.overlaps(ladder)) {
                bounds.onLadder = true
            }
            if (body.isOn(ladder)) {
                bounds.onTopLadder = true
            }
        }

        for (const line of this.lines) {
            if (line.left < body.right && line.right > body.left) {
                if (body.atOneLine(line)) {
                    bounds.underLine = true
                }
            }
        }
        return bounds
    }

    tick(scale) {
        if (this.paused || this.hidden) return

        this.guy.tick(scale, this.setBounds(this.guy))

        for (let enemy of this.enemies) {
            enemy.tick(scale, this.setBounds(enemy), this.guy)
            if (this.lost(enemy)) {
                enemy.death()
                this.enemies.splice(this.enemies.indexOf(enemy),1)
                console.log(this.enemies)
            }
        }

        if (leftShootKey()) {
            this.shootLeftBar()
        }
        if (rightShootKey()) {
            this.shootRightBar()
        }
         if (giveUpKey()) {
             this.death(this.guy)
         }

        let curLevel = false
        for (const goal of this.goals) {
            if (!goal.hidden) {
                curLevel = true
            }
            if (!goal.hidden && this.guy.overlaps(goal)) {
                goal.hidden = true;
                curLevel = true
            }
        }
        if (this.lost(this.guy)) {
            this.death(this.guy)
        } else if (!curLevel) {
            this.advance()
        }
    }

    loadNet(isDebug) {
        if (isDebug) {
            let x = 0,
                y = 0;
            while (y < BOX_HEIGHT) {
                let line = create('line')
                line.setAttribute('x1', x)
                line.setAttribute('y1', y)
                line.setAttribute('x2', BOX_WIDTH)
                line.setAttribute('y2', y)
                line.setAttribute('stroke', 'red')
                this.prepend(new Body(line))
                y += HEIGHT
            }
            x = 0
            y = 0;
            while (x < BOX_WIDTH) {
                let line2 = create('line')
                line2.setAttribute('x1', x)
                line2.setAttribute('y1', y)
                line2.setAttribute('x2', x)
                line2.setAttribute('y2', BOX_HEIGHT)
                line2.setAttribute('stroke', 'red')
                this.prepend(new Body(line2))

                x += WIDTH
            }
        }
    }

    mousemove(event) {
        // let w_new = this.clientWidth / 24,
        //     h_new = this.clientHeight / 15;
        // console.log(Math.trunc(event.offsetX / w_new), Math.trunc(event.offsetY / h_new))
    }

    async shootLeftBar() {
        for (let bar of this.bars) {
            if (bar.x === this.guy.x - WIDTH && bar.y === this.guy.y + HEIGHT && bar.on && !bar.stable) {
                bar.on = false
                await bar.tick()
                break
            }
        }
    }

    async shootRightBar() {
        for (let bar of this.bars) {
            if (bar.x === this.guy.x + WIDTH && bar.y === this.guy.y + HEIGHT && bar.on && !bar.stable) {
                bar.on = false
                await bar.tick()
                break
            }
        }
    }

}
