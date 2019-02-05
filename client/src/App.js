import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor () {
    super()

    this.state = {
      responseToGet: '',
      responseToPost: '',
      responseToPostParams: ''
    }

    this.getTest = this.getTest.bind(this)
    this.postTest = this.postTest.bind(this)
  }

  componentDidMount () {
    this.postTest()
    this.getTest()
  }

  getTest () {
    window.fetch(`api/get`, {
      method: 'GET'
    }).then((response) => {
      if (response.status === 200) return response.json()
    }).then((jsonResponse) => {
      this.setState({responseToGet: jsonResponse.server})
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
      console.log('jsonResponse', jsonResponse.params)
      this.setState({
        responseToPost: jsonResponse.server,
        responseToPostParams: jsonResponse.params
      })
    })
  }

  render () {
    return (
      <div className={'App'}>
        <header className={'App-header'}>
          <img src={logo} className={'App-logo'} alt={'logo'} />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={'App-link'}
            href={'https://reactjs.org'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            Learn React
          </a>
        </header>
        <p>{this.state.responseToGet}</p>
        <p>{this.state.responseToPost} The body passed was: "{this.state.responseToPostParams}"</p>
      </div>
    )
  }
}

export default App
