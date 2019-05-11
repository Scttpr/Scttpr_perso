// Import from Yarn
import React from 'react';
import PropTypes from 'prop-types';
// Import from locals
import './Chat.scss';
import Message from '../Message';

// Code
const Chat = ({ chat }) => (
  <div id="chat" className="ui centered">
    {
      chat.map(({ author, content, _id }) => (
        <Message
          key={_id}
          id={_id}
          author={author}
          content={content}
        />
      ))
    }
  </div>
);

Chat.propTypes = {
  chat: PropTypes.arrayOf(PropTypes.object).isRequired,
};

// Export if needed
export default Chat;
