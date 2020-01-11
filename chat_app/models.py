import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone

class User(AbstractUser):
    leido = models.DateTimeField(auto_now_add=True)
    online = models.BooleanField(default=False)

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    def lectura(self):
        self.leido = timezone.now()
        self.save()

    def mensajes_noleidos(self):
        return Mensaje.objects.filter(created_at__gt=self.leido).count()


def validate_message_content(texto):
    if texto is None or not texto.strip():
        raise ValidationError('El Mensaje no puede estar vacío', code='invalid', params={'content': texto},)

class Mensaje(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    autor = models.ForeignKey('User', related_name='mensajes_autor', on_delete=models.CASCADE)
    texto = models.TextField(validators=[validate_message_content])
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True)

    def recientes():
        return Mensaje.objects.order_by('-fecha_creacion').all()[:20]
