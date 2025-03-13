"""finding_imago_mundi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from .index import index
from imago_mundi_app import views

api_router = routers.DefaultRouter()  # register viewsets with this router
# registered for imagomundi data
api_router.register(r'imagomundi', views.ImagoMundiViewSet, basename='api')


urlpatterns = [
    path(r'admin/', admin.site.urls),
    path(r'api/', include(api_router.urls)),
    path(r'api-auth/', include(
        'rest_framework.urls',
        namespace='rest_framework',
    )),
    # temporally the geocode here
    path(r'admin/imago_mundi_app/imagomundi/geocode',
        views.geocode, name='geocode'),
    path(r'admin/imago_mundi_app/geocode',
        views.geocode, name='geocode'),
    #path(r'^geocode/', views.geocode, name='geocode'),
    path(r'api_key', views.get_api_key, name='apikey'),
    path(r'', index),  # catch-all; unknown paths to be handled by a SPA
]
