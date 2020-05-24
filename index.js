import Game from './src/Game.js'

const game = new Game

const level = new URL(window.location).searchParams.get('level')

if (level) {
  try {
    game.scene.levels = [JSON.parse(level)]
    game.scene.fromURL = true
    game.scene.index = 0
    game.state = 'play'
  } catch (error) {}
}

const index = new URL(window.location).searchParams.get('index')
if (index) {
  // console.log(level);
  try {
    game.scene.fromURL = true
    game.scene.index = index;
    game.state = 'play'
  } catch (error) {}
}

let previous = 0
requestAnimationFrame(function tick (time) {
  // To deal with different frame rates, we define per-second speeds and adjust
  // them according to the time since the last frame was rendered.
  const duration = time - previous
  // console.log(duration)
  game.tick((value) => Math.round(value * duration / 1000))
  previous = time
  requestAnimationFrame(tick)
})
