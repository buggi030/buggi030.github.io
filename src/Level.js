import {WIDTH} from "./config.js";

export default class Level {
    constructor(guy, goal, bars, spikes, ladders, lines) {
        this.guy(guy)
        this.goal(goal)
        this.bars(bars)
        this.spikes(spikes)
        this.ladders(ladders)
        this.lines(lines)
    }

    get goal() {
        return this._goal
    }

    set goal(value) {
        this._goal = value.map(this.dimensions)
    }

    get bars() {
        return this._bars
    }

    set bars(value) {
        this._bars = value.map(this.dimensions)
    }

    get guy() {
        return this._guy
    }

    set guy(value) {
        this._guy = value.map(this.dimensions)
    }

    get spikes() {
        return this._spikes
    }

    set spikes(value) {
        this._spikes = value.map(this.dimensions)
    }

    get ladders() {
        return this._ladders
    }

    set ladders(value) {
        this._ladders = value.map(this.dimensions)
    }

    get lines() {
        return this._lines
    }

    set lines(value) {
        this._lines = value.map(this.dimensions)
    }

    dimensions(item) {
        if (Array.isArray(item)) {
            return item.map(this.dimensions)
        } else if (Number.isFinite(item)) {
            return item * WIDTH
        } else {
            return item
        }
    }

    * [Symbol.iterator]() {
        yield this.guy
        yield this.goal
        yield this.bars
        yield this.spikes
        yield this.ladders
        yield this.lines
    }
}