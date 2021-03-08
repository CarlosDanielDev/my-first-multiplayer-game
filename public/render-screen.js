export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId, document) {

    const { state } = game
    const div = document.getElementById('score-players')
    const list = document.createElement('ul')

    div.innerHTML= ''
    div.appendChild(list)
    for (const playerId in state.players) {
      const listItem = document.createElement('li')
      const player = state.players[playerId]
      const text = document.createTextNode(`score: ${player.score} - ${playerId}`)
      listItem.appendChild(text)
      list.appendChild(listItem)
    }
  
  
  
  const context = screen.getContext('2d')

  context.fillStyle = 'white'
  context.clearRect(0, 0, 10, 10)
  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    context.fillStyle = '#000'
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId]
    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = game.state.players[currentPlayerId]
  if(currentPlayer) {
    context.fillStyle = '#7159c1'
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId, document)
  })
}
