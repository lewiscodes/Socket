import React, { Component } from 'react'
import io from 'socket.io-client'
import { withStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Blue from '@material-ui/core/colors/blue'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Green from '@material-ui/core/colors/green'
import Grey from '@material-ui/core/colors/grey'
import Paper from '@material-ui/core/Paper'
import Purple from '@material-ui/core/colors/purple'
import Red from '@material-ui/core/colors/red'
import TextField from '@material-ui/core/TextField'

const socket = io.connect()
const colors = [Red, Green, Blue, Purple]
const styles = theme => ({
  root: {
    height: '100%',
    padding: theme.spacing.unit * 3,
    backgroundColor: Grey[300]
  },
  textfieldContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  textfield: {
    backgroundColor: 'white',
    marginRight: theme.spacing.unit,
    flexGrow: 1
  },
  paper: {
    height: 300,
    marginBottom: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  message: {
    padding: theme.spacing.unit,
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing.unit
  }
})

class App extends Component {
  constructor () {
    super()

    this.state = {
      modalClosed: false,
      forename: '',
      surname: '',
      textfield: '',
      messages: [],
      users: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleModalSubmit = this.handleModalSubmit.bind(this)
  }

  componentDidMount () {
    this.postTest()
    this.getTest()

    socket.on('chat message', (message) => {
      const { messages } = this.state
      messages.push(message)
      this.setState({messages})
    })

    socket.on('new user', (user) => {
      let { users } = this.state
      const int = users.length
      user.color = colors[int][500]
      users.push(user)
      this.setState({users})
    })

    socket.on('user disconnect', (disconnectedUserId) => {
      let { users } = this.state
      users = users.filter((user) => {
        return user.id !== disconnectedUserId
      })
      this.setState({users})
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

  handleModalSubmit () {
    const { forename, surname } = this.state

    this.setState({modalClosed: true})
    socket.emit('register', {forename, surname})
  }

  renderMessages () {
    const { classes } = this.props

    return this.state.messages.map((message, index) => {
      const user = this.state.users.filter((user) => user.id === message.uid)[0]
      let { initials, color } = ''

      if (user) {
        color = user.color
        initials = `${user.forename.substr(0, 1)}${user.surname.substr(0, 1)}`
      } else {
        color = Grey[300]
        initials = '?'
      }

      return (
        <React.Fragment key={index}>
          <div className={classes.message}>
            <Avatar className={classes.avatar} style={{backgroundColor: color}}>{initials || '?'}</Avatar>
            <span style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{message.message}</span>
          </div>
          <Divider />
        </React.Fragment>
      )
    })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          {this.renderMessages()}
        </Paper>
        <div className={classes.divider} />
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
        <Dialog
          open={!this.state.modalClosed}
        >
          <DialogTitle>What is your name?</DialogTitle>
          <DialogContent>
            <TextField
              margin={'dense'}
              label={'First Name'}
              onChange={(e) => this.setState({forename: e.target.value})}
              value={this.state.forename}
              fullWidth
            />
            <TextField
              margin={'dense'}
              label={'Last Name'}
              onChange={(e) => this.setState({surname: e.target.value})}
              value={this.state.surname}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalSubmit} color={'primary'}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(App)
