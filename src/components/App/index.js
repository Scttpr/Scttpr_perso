// == Import : npm
import React, { Component } from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';

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

  componentDidMount() {
    axios.get('http://localhost:3000/')
      .then((result) => {
        console.log(result.data.messages);
        this.setState({
          chat: result.data.messages,
        });
      })
      .catch(err => console.log(err));

    const socket = openSocket('http://localhost:3000');
    socket.on('posts', data => {
      const { chat } = this.state;
      chat.push(data.message);
      this.setState({
        chat,
      });
    });
  }

  addMessage = (author, content) => {
    axios.post('http://localhost:3000/', {
      author,
      content,
    })
      .then((result) => {
        const { chat } = this.state;
        this.setState({
          author: '',
          content: '',
          chat: [
            ...chat,
            result.data.content,
          ],
        });
      })
      .catch(err => console.log(err));
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
