import React, { Component } from 'react'
import io from 'socket.io-client'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const socket = io.connect()
const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3
  },
  textfieldContainer: {
    display: 'flex'
  },
  textfield: {
    marginRight: theme.spacing.unit
  }
})

class App extends Component {
  constructor () {
    super()

    this.state = {
      textfield: '',
      messages: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.postTest()
    this.getTest()

    socket.on('chat message', (message) => {
      this.setState({messages: message})
    })
  }

  getTest () {
    window.fetch(`api/get`, {
      method: 'GET'
    }).then((response) => {
      if (response.status === 200) return response.json()
    }).then((jsonResponse) => {
      console.log('Response to GET:', jsonResponse.server)
    })
  }

  postTest () {
    window.fetch(`/api/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({client: 'Hello World!'})
    }).then((response) => {
      if (response.status === 200) return response.json()
    }).then((jsonResponse) => {
      console.log('Response to POST:', jsonResponse.server)
      console.log('Original Params passed to POST:', jsonResponse.params)
    })
  }

  handleSubmit () {
    socket.emit('chat', this.state.textfield)
    this.setState({textfield: ''})
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <span>{this.state.messages}</span>
        <div className={classes.textfieldContainer}>
          <TextField
            className={classes.textfield}
            placeholder={'Chat here...'}
            variant={'outlined'}
            value={this.state.textfield}
            onChange={(e) => { this.setState({textfield: e.target.value}) }}
            onKeyPress={(e) => { if (e.key === 'Enter') this.handleSubmit() }}
          />
          <Button
            variant={'contained'}
            color={'primary'}
            className={classes.button}
            size={'large'}
            onClick={this.handleSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(App)
