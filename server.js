import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import * as io from 'socket.io'
import cors from 'cors'

const app = express()

app.use(cors())
const server = http.createServer(app)
const sockets = new io.Server(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
  console.log(`> Emitting the subscription ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const {id: playerId} = socket
  console.log(`> Hello a new player ${playerId} has been connected!`)

  game.addPlayer({playerId})

  socket.emit('start', game.state)
  
  socket.on('disconnect', () => {
    console.log(`> Opps! the player ${playerId} has disconnected`)
    game.removePlayer({ playerId })
  })

  socket.on('moving-player', (command) => {
    command.playerId = playerId
    command.type = 'moving-player'

    game.movePlayer(command)
  })
})


server.listen(3000, () => {
  console.log('> Server listen on 3000')
})
