from django.db import models
from django.contrib.auth.models import AbstractUser

class Subdivision(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Type(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Object(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Master(models.Model):
    first_name = models.CharField(max_length=100, unique=True)
    last_name = models.CharField(max_length=100, unique=True)
    patronymic = models.CharField(max_length=100, unique=True)

    object = models.ForeignKey(Object, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.last_name + " " + self.first_name + " " + self.patronymic

class Request(models.Model):
    subdivision = models.ForeignKey(Subdivision, on_delete=models.SET_NULL, null=True)
    distance = models.PositiveIntegerField()
    master = models.ForeignKey(Master, on_delete=models.SET_NULL, null=True)
    date_type_quantity_plannedWorkTime = models.JSONField()
    processed_by_logistician = models.BooleanField(default=False)


class CustomUser(AbstractUser):
    # Добавляем поле для роли
    ROLE_CHOICES = (
        ('master', 'Мастер бригады'),
        ('logistician', 'Логист'),
        ('dispatcher', 'Центральный диспетчер'),
        ('admin', 'Администратор'),
    )
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
    )

    subdivision = models.ForeignKey(Subdivision, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.username
