import React, { Component } from 'react';
import { Form, Row, Col, Button, Card} from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment/locale/es';
import WebSocketInstance from '../../services/WebSocket'
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.waitForSocketConnection(() => {
      WebSocketInstance.initChatUser(this.props.currentUser);
      WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
      WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        if (WebSocketInstance.state() === 1) {
          console.log("Conectado")
          callback();
          return;
        } else {
          console.log("Reconectando...")
          component.waitForSocketConnection(callback);
        }
    }, 100);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const chat = this.messagesEnd;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    chat.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    this.setState({ messages: messages.reverse()});
  }

  messageChangeHandler = (event) =>  {
    this.setState({
      message: event.target.value
    })
  }

  sendMessageHandler = (e, message) => {
    const messageObject = {
      from: this.props.currentUser,
      text: message
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: ''
    })
    e.preventDefault();
  }

  renderMessages = (messages) => {
    const currentUser = this.props.currentUser;
    return messages.map((message, i) => 
    <li key={message.id} className={message.autor === currentUser ? 'yo' : 'respuesta'}> 
    <h4 className='author'>{ message.autor === currentUser ? 'Yo' : message.autor }</h4>
    <p>{ message.texto }</p><h4 className='author'><Moment fromNow locale="es">{message.fecha_creacion}</Moment></h4></li>);
  }

  render() {
    const messages = this.state.messages;
    const currentUser = this.props.currentUser;
    return (
      <div className="container chat">
        <br />
        <Card>
            <Card.Body>
        <div className='container'>
              <h1>Bienvenido {currentUser} </h1>
              <h3>Mensajes Recientes</h3>
              <ul ref={(el) => { this.messagesEnd = el; }}>
              { 
                  messages && 
                  this.renderMessages(messages) 
              }
              </ul>
        </div>
        <div className='container message-form'>
          <Form onSubmit={(e) => this.sendMessageHandler(e, this.state.message)} className='form'>
              <Form.Group as={Row}>
                  <Col sm="4">
                      <Form.Control plaintext onChange={this.messageChangeHandler} 
                        value={this.state.message} placeholder="Escribe un mensaje" required/>
                  </Col>
                  <Col sm="4">
                    <Button variant="primary" type="submit" value="Submit">Enviar</Button>
                  </Col>
              </Form.Group>
          </Form>
        </div>
        </Card.Body>
          </Card>
      </div>
    );
  }
}