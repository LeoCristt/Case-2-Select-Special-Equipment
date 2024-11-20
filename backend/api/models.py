from django.db import models
from django.contrib.auth.models import AbstractUser

class Request(models.Model):
    subdivision = models.CharField(max_length=100)
    distance = models.PositiveIntegerField()
    master = models.CharField(max_length=100)
    date_type_quantity_plannedWorkTime = models.JSONField()

class Subdivision(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    # Добавляем поле для роли
    ROLE_CHOICES = (
        ('master', 'Мастер бригады'),
        ('logistician', 'Логист'),
        ('dispatcher', 'Центральный диспетчер'),
    )
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
    )

    subdivision = models.ForeignKey(Subdivision, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.username
