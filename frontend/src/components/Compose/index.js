import React from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import './Compose.css';

export default function Compose(props) {

    return (
      <Form className="compose" onSubmit={props.handleSubmitMsg}>
        {/*<input
          type="text"
          className="compose-input"
          placeholder="Entrez votre message..."
        />
        
        {
          props.rightItems
        } */}

          <InputGroup className="">
              <FormControl className="compose-input" name="msg_text" placeholder="Entrez votre message" />
              <InputGroup.Append>
                  <Button type="submit" variant="outline-secondary">Envoyer </Button>
              </InputGroup.Append>
          </InputGroup>
      </Form>
    );
}