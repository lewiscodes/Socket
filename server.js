const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

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

  connection.on('chat', (message) => {
    console.log(`Chat message received from ${connection.id}: ${message}`)
    io.emit('chat message', message)
  })

  connection.on('disconnect', () => {
    console.log(`Client ${connection.id} disconnected.`)
  })

  connection.on('error', (err) => {
    console.log(`Client ${connection.id} threw an error: ${err}`)
  })
})
