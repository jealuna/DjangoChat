import React, { Component } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

export default class Inicio extends Component {

  constructor(props) {
      super(props);
      this.state = {
        value: ''
      };
    }

  usernameChangeHandler = (event) =>  {
    this.setState({
      username: event.target.value
    })
  }

  render() {

    return (
    <div className="container">
      <br />
      <Card>
        <Card.Body>
          <h2>Bienvenido</h2>
          <Form onSubmit={() => this.props.onSubmit(this.state.username)}>
              <Form.Group as={Row}>
                  <Form.Label column sm="2">Nombre</Form.Label>
                  <Col sm="8">
                      <Form.Control onChange={this.usernameChangeHandler} 
                        plaintext placeholder="Ingresa tu nombre" required/>
                  </Col>
                  <Col sm="2">
                    <Button variant="primary" type="submit" value="Submit">Guardar</Button>
                  </Col>
              </Form.Group>
          </Form>
        </Card.Body>
        </Card>
    </div>
    );
  }
}