from django.db import models

class Request(models.Model):
    subdivision = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    plannedWorkTime = models.PositiveIntegerField()
    distance = models.PositiveIntegerField()
    master = models.CharField(max_length=100)
    date = models.DateTimeField()

    def __str__(self):
        return self.title
