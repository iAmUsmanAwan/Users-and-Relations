from rest_framework import serializers
from .models import User, Relationship

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone_number']

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ['id','user1', 'user2', 'relationship_type']

    def validate(self, data):
        # Example validation logic
        if data['user1'] == data['user2']:
            raise serializers.ValidationError("A user cannot have a relationship with themselves.")
        return data

