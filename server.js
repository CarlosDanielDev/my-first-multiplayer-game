import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import * as io from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = new io.Server(server)

app.use(express.static('public'))

const game = createGame()

game.addPlayer({
  playerId: 'player1',
  playerX:0,
  playerY: 0
})

game.addFruit({
  fruitId: 'fruit1',
  fruitX:7,
  fruitY: 5
})

sockets.on('connection', (socket) => {
  const {id: playerId} = socket
  console.log(`> Player ${playerId} has been connected!`)

  socket.emit('start', game.state)
})

server.listen(3000, () => {
  console.log('> Server listen on 3000')
})
