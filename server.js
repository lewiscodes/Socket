const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080
let users = []

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/get', (req, res) => {
  res.send({ server: 'GET request successful.' })
})

app.post('/api/post', (req, res) => {
  res.send({
    server: 'POST request successful.',
    params: req.body.client
  })
})

io.on('connection', (connection) => {
  console.log('A user connected')

  connection.on('register', (details) => {
    const id = connection.id
    const { forename, surname } = details
    const user = {id, forename, surname}
    users.push(user)
    io.emit('new user', user)
  })

  connection.on('chat', (message) => {
    console.log(`Chat message received from ${connection.id}: ${message}`)
    const user = users.filter((user) => user.id === connection.id)[0]
    io.emit('chat message', {uid: user.id, message})
  })

  connection.on('disconnect', () => {
    console.log(`Client ${connection.id} disconnected.`)
    users = users.filter((user) => user.id !== connection.id)
    io.emit('user disconnect', connection.id)
  })

  connection.on('error', (err) => {
    console.log(`Client ${connection.id} threw an error: ${err}`)
  })
})
