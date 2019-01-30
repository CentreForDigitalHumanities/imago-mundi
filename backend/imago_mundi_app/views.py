from django.shortcuts import render
from rest_framework import viewsets
from imago_mundi_app.models import ImagoMundi
from imago_mundi_app.serializers import ImagoMundiSerializer
from rest_framework import permissions

# Create your views here.


class ImagoMundiViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = ImagoMundi.objects.all().order_by('title')
    serializer_class = ImagoMundiSerializer
    # permission_classes = [
    #     permissions.IsAuthenticatedOrReadOnly, YourPermissionshere, ] # werkt nog niet, maar zou enkel lezen moeten zijn
