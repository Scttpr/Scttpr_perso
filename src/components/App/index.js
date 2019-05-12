// == Import : npm
import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// == Import : local
import './app.scss';
import Chat from '../Chat';
import Form from '../Form';

// == Composant
class App extends Component {
  state = {
    author: '',
    content: '',
    chat: [],
  }

  socket = io('http://localhost:3000/');

  componentDidMount() {
    this.connectSocket();
    this.socket.on('newMessage', (data) => {
      this.updateChat(data);
    });
  }

  connectSocket = () => {
    this.socket.emit('connection');
    this.socket.on('confirm', (data) => {
      console.log(data);
    });
  }

  updateChat = (data) => {
    const { chat } = this.state;
    const newChat = [
      ...chat,
      data,
    ];
    this.setState({
      content: '',
      chat: newChat,
    });
  }

  addMessage = (author, content) => {
    this.socket.emit('addMessage', { author, content });
  }

  setInputChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { author, content, chat } = this.state;
    return (
      <div id="app">
        <h1 className="ui header">Un chat en websocket</h1>
        <Chat chat={chat} />
        <Form
          authorValue={author}
          contentValue={content}
          addMessage={this.addMessage}
          setInputChange={this.setInputChange}
        />
      </div>
    );
  }
}

export default App;
