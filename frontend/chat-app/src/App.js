import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inicio from './components/Inicio'
import Chat from './components/Chat'
import WebSocketInstance from './services/WebSocket'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      loggedIn: false
    };
  }

  handleLoginSubmit = (username) => {
    this.setState({ loggedIn: true, username: username });
    WebSocketInstance.connect();
  }

  render() {
    const { 
      loggedIn,
      username
    } = this.state;

    return (
      <div className="App">
        { 
          loggedIn ?
          <Chat
            currentUser={username}
          />
          :
          <Inicio
            onSubmit={this.handleLoginSubmit}
            usernameChangeHandler={this.usernameChangeHandler}
          />
        }
      </div>
    );
  }
}