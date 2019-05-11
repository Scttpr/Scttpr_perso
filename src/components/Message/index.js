// Import from Yarn
import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';

// Import from locals
import './Message.scss';

// Code
const Message = ({ author, content, id }) => (
  <Comment className="message" id={id}>
    <Comment.Content>
      <Comment.Author as="a">{author}</Comment.Author>
      <Comment.Text>{content}</Comment.Text>
    </Comment.Content>
  </Comment>
);

Message.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

// Export if needed
export default Message;
