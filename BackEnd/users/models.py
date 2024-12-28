from django.db import models
from django.contrib.auth.models import User

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class Relationship(models.Model):
    user1 = models.ForeignKey(User, related_name='user1_relationships', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='user2_relationships', on_delete=models.CASCADE)
    relationship_type = models.CharField(max_length=50)  # Example: 'friend', 'family', etc.

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user1', 'user2'],
                name='unique_relationship_user1_user2'
            ),
            models.UniqueConstraint(
                fields=['user2', 'user1'],
                name='unique_relationship_user2_user1'
            ),
        ]
    def __str__(self):
        return f"{self.user1} - {self.user2}: {self.relationship_type}"
