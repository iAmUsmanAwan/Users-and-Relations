from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Relationship
from .serializers import UserSerializer, RelationshipSerializer
from django.shortcuts import render
from django.views.generic import TemplateView


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer

class ReactAppView(TemplateView):
    template_name = 'index.html'

class UserListCreate(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class RelationshipList(APIView):
    def get(self, request):
        relationships = Relationship.objects.all()
        serializer = RelationshipSerializer(relationships, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RelationshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
