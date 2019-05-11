// Import from Yarn
import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button } from 'semantic-ui-react';

// Import from locals
import './Form.scss';

// Code
const MessageForm = ({
  authorValue,
  contentValue,
  setInputChange,
  addMessage,
}) => {
  const handleChange = (evt) => {
    const { value, name } = evt.target;
    setInputChange(value, name);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { author, content } = evt.target;
    addMessage(author.value, content.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label id="author" htmlFor="author">Ton nom:</label>
        <input className="input" value={authorValue} onChange={handleChange} name="author" placeholder="ex: Francis" />
      </Form.Field>
      <Form.Field>
        <label id="content" htmlFor="content">Ton message</label>
        <TextArea className="input" value={contentValue} onChange={handleChange} name="content" placeholder="Ex: J'aime me beurrer la biscotte" />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>

  );
};

MessageForm.propTypes = {
  setInputChange: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  authorValue: PropTypes.string.isRequired,
  contentValue: PropTypes.string.isRequired,
};

// Export if needed
export default MessageForm;
