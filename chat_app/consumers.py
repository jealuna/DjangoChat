import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import User, Mensaje


class ChatConsumer(WebsocketConsumer): 
    def init_chat(self, data):
        username = data['username']
        user, creado = User.objects.get_or_create(username=username)
        content = {'command': 'init_chat'}
        if not user:
            content['error'] = 'Ocurrió un error al crear el usuario'
            self.send_message(content)
        content['success'] = f'Se ha ingresado al chat con el usuario {username}'
        self.send_message(content)

    def fetch_messages(self, data):
        mensajes = Mensaje.recientes()
        content = {'command': 'messages', 'messages': self.json_mensajes(mensajes)}
        self.send_message(content)

    def new_message(self, data):
        autor = data['from']
        texto = data['text']
        autor_user, created = User.objects.get_or_create(username=autor)
        mensaje = Mensaje.objects.create(autor=autor_user, texto=texto)
        content = { 'command': 'new_message', 'message': self.json_mensajes([mensaje])[0]}
        self.send_chat_message(content)

    def json_mensajes(self, mensajes):
        result = []
        for mensaje in mensajes:
            mensaje_object = {
                'id': str(mensaje.id),
                'autor': mensaje.autor.username,
                'texto': mensaje.texto,
                'fecha_creacion': str(mensaje.fecha_creacion)
            }
            result.append(mensaje_object)
        return result
    
    commands = {
        'init_chat': init_chat,
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = 'Demo'
        self.room_group_name =  f'chat_{self.room_name}'
        async_to_sync(self.channel_layer.group_add)(self.room_group_name,self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))