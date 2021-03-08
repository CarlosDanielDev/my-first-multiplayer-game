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

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const {id: playerId} = socket
  console.log(`> Player ${playerId} has been connected!`)

  game.addPlayer({playerId})

  socket.emit('start', game.state)
  
  socket.on('disconnect', () => {
    console.log(`> Player ${playerId} has disconnected`)

    game.removePlayer({ playerId })
  })
})


server.listen(3000, () => {
  console.log('> Server listen on 3000')
})
