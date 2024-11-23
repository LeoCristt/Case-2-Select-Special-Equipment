from django.db import models
from django.contrib.auth.models import AbstractUser

class Driver(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name

class Subdivision(models.Model):
    name = models.CharField(max_length=100, unique=True, primary_key=True)

    def __str__(self):
        return self.name
    
class Machinery(models.Model):
    type = models.CharField(max_length=100)
    kind = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    license_plate = models.CharField(max_length=100, unique=True, primary_key=True)
    technical_passport = models.JSONField()
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    subdivision = models.ForeignKey(Subdivision, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.license_plate
    
class Facility(models.Model):
    name = models.CharField(max_length=100, unique=True, primary_key=True)

    def __str__(self):
        return self.name
    
class Master(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

class Request(models.Model):
    subdivision = models.ForeignKey(Subdivision, on_delete=models.SET_NULL, null=True)
    distance = models.PositiveIntegerField()
    master = models.ForeignKey(Master, on_delete=models.SET_NULL, null=True)
    date_type_quantity_plannedWorkTime_machinery = models.JSONField()
    processed_by_logistician = models.BooleanField(default=False)

class Waybill(models.Model):
    machinery = models.ForeignKey(Machinery, on_delete=models.SET_NULL, null=True)
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True)
    planned_time_of_departure = models.DateTimeField()
    planned_time_of_arrival_at_the_facility = models.DateTimeField()
    planned_time_of_work_at_the_facility = models.DateTimeField()
    actual_time_of_departure = models.DateTimeField(null=True, blank=True)
    actual_time_of_arrival_at_the_facility = models.DateTimeField(null=True, blank=True)
    actual_time_of_work_at_the_facility = models.DateTimeField(null=True, blank=True)
    actual_time_of_waiting_at_the_facility = models.DateTimeField(null=True, blank=True)
    closed = models.BooleanField(default=False)

    
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
