from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RelationshipViewSet, ReactAppView, UserList, RelationshipList, UserListCreate

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'relationships', RelationshipViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', ReactAppView.as_view(), name='home'),  # Serve React app at root
    path('api/', include(router.urls)),
    path('api/users/', UserListCreate.as_view(), name='user-list-create'),
    path('users/', UserList.as_view(), name='user-list'),
    path('relationships/', RelationshipList.as_view(), name='relationship-list'),
]
