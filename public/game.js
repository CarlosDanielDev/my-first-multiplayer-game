export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {

    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function updateState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const { playerId } = command
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY
    })
  }

  function removePlayer(command) {
    const { playerId } = command

    delete state.players[playerId]
  }

  function addFruit(command) {
    const {
      fruitId, 
      fruitX, 
      fruitY 
    } = command

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }
  }

  function removeFruit(command) {
    const { fruitId } = command

    delete state.fruits[fruitId]
  }

  function movePlayer(command) {
    console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

    const acceptedMoves = {
      ArrowUp(player) {
        if(player.y - 1 >= 0) {
          player.y--
        } else {
          player.y = state.screen.height - 1
        }
      },
      ArrowDown(player) {
        if(player.y + 1 < state.screen.height) {
          player.y++
        } else {
          player.y = 0
        }
      },
      ArrowRight(player) {
        if(player.x + 1 < state.screen.width) {
          player.x++
        } else {
          player.x = 0
        }
      },
      ArrowLeft(player) {
        if(player.x - 1 >= 0) {
          player.x--
        } else {
          player.x = state.screen.width - 1
        }
      }
    }
    const { keyPressed, playerId } = command
    const player = state.players[playerId]
    const moveFunction = acceptedMoves[keyPressed]

    if(player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)
    }
    return
  }

  function checkForFruitCollision(playerId) {
      const player = state.players[playerId]

      for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId]

        if(player.x === fruit.x && player.y === fruit.y) {
          console.log(`Collision between ${playerId} and ${fruitId}`)
          removeFruit({ fruitId })
        }
      }
  }

  return {
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    updateState,
    subscribe
  }
}
