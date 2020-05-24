export const DOWN = new Set
export const PRESSED = new Set

const NO_DEFAULT = new Set([
  'w',
  'a',
  's',
  'd',
  ' ',
  'y',
  'x',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter'
])

export const upKey = () => (
  DOWN.has('w') || DOWN.has('ArrowUp') || PRESSED.has(0) || PRESSED.has(12)
)

export const downKey = () => (
    DOWN.has('s') || DOWN.has('ArrowDown')
)

export const leftKey = () => (
  DOWN.has('a') || DOWN.has('ArrowLeft') || PRESSED.has(14)
)

export const rightKey = () => (
  DOWN.has('d') || DOWN.has('ArrowRight') || PRESSED.has(15)
)

export const leftShootKey = () => (
    DOWN.has('y')
)

export const rightShootKey = () => (
    DOWN.has('x')
)

export const giveUpKey = () => (
    DOWN.has('Enter')
)

document.addEventListener('keydown', (event) => {
  DOWN.add(event.key)
  if (NO_DEFAULT.has(event.key)) event.preventDefault()
})

document.addEventListener('keyup', ({key}) => {
  DOWN.delete(key)
})

const HANDLERS = new Map
export const onPress = (index, f) => {
  if (!HANDLERS.has(index)) HANDLERS.set(index, [])
  HANDLERS.get(index).push(f)
}

requestAnimationFrame(function tick (time) {
  const pad = navigator.getGamepads()[0]
  if (!pad) {
    PRESSED.clear()
    return
  }
  pad.buttons.forEach((button, index) => {
    if (button.pressed) {
      if (!PRESSED.has(index)) {
        const handlers = HANDLERS.get(index)
        if (handlers) handlers.forEach((f) => f())
      }
      PRESSED.add(index)
    } else {
      PRESSED.delete(index)
    }
  })
  requestAnimationFrame(tick)
})
