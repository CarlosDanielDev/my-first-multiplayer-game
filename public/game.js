export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = []
  const maxFruits = 3

  function start(frequency = 2000) {
    setInterval(addFruit, frequency)
  }


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
    const playerX = 'playerX' in command 
    ? command.playerX 
    : Math.floor(Math.random() * state.screen.width)

    const playerY = 'playerY' in command 
    ? command.playerY 
    : Math.floor(Math.random() * state.screen.height)

    const score = 0

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      score
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      score
    })
  }

  function removePlayer(command) {
    const { playerId } = command

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId
    })
  }

  function addFruit(command) {
    const currentLength = Object.keys(state.fruits).length
    if(currentLength <= maxFruits) {
    const fruitId = command 
    ? command.fruitId 
    : Math.floor(Math.random() * 100000)

    const fruitX = command 
    ? command.fruitX 
    : Math.floor(Math.random() * state.screen.width)

    const fruitY = command 
    ? command.fruitY 
    : Math.floor(Math.random() * state.screen.height)
    
    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }
    
    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY
    })
  }

  }

  function removeFruit(command) {
    const { fruitId } = command

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId
    })
  }

  function movePlayer(command) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if(player.y - 1 >= 0) {
          player.y--
        }
      },
      ArrowDown(player) {
        if(player.y + 1 < state.screen.height) {
          player.y++
        }
      },
      ArrowRight(player) {
        if(player.x + 1 < state.screen.width) {
          player.x++
        }
      },
      ArrowLeft(player) {
        if(player.x - 1 >= 0) {
          player.x--
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
          console.log(`> Collision between ${playerId} and ${fruitId}`)
          removeFruit({ fruitId })
          player.score++
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
    subscribe,
    start
  }
}
