const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
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

app.listen(port, () => console.log(`Listening on port ${port}`))
