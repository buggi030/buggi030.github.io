import Title from "./title.js";
import Controls from "./controls.js";
import levels from "./levels2.js";
import Editor from "./editor.js";
import {onPress} from "./keys.js";
import Scene from './Scene.js'

export default class Game {
    constructor () {
        this.title = new Title(this)
        this.controls = new Controls(this)
        this.scene = new Scene(this, levels)
        this.editor = new Editor(
            [[[100, 300], [500, 300], [[84,361,362,48,1]], [[446,401,176,8,1,"up"]]]],
            this
        )
        this.dialog = document.getElementById('dialog')
        onPress(1, this.toggle.bind(this))
        document.addEventListener('keydown', this.keydown.bind(this))
        // document.addEventListener('mousemove', this.mousemove.bind(this))

    }

    toggle () {
        this.scene.on = !this.scene.on
        // if (this.scene.on) OFF_FX.play()
        // else ON_FX.play()
    }

    keydown (event) {
        if (event.key === ' ') this.toggle()
        if (!this.scene.hidden) this.scene.keydown(event)
        else if (!this.controls.hidden) this.controls.keydown(event)
        else if (!this.title.hidden) this.title.keydown(event)
    }

    mousemove (event) {
        if (!this.scene.hidden) this.scene.mousemove(event)
    }


    get state () {
        return this._state
    }

    set state (value) {
        this._state = value

        this.scene.hidden = this.state !== 'play'
        this.title.hidden = this.state !== 'title'
        this.controls.hidden = this.state !== 'controls'
        this.editor.hidden = this.state !== 'edit'
        this.dialog.hidden = this.state !== 'edit'
    }

    tick (scale) {
        this.scene.tick(scale)
        this.controls.tick(scale)
    }
}
