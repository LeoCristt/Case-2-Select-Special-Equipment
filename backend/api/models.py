from django.db import models

class Request(models.Model):
    subdivision = models.CharField(max_length=100)
    distance = models.PositiveIntegerField()
    master = models.CharField(max_length=100)
    date_type_quantity_plannedWorkTime = models.JSONField()
