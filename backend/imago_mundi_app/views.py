import logging
import os

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.postgres.search import SearchQuery
from django.conf import settings
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework import filters
from geopy.geocoders import Nominatim

from imago_mundi_app.models import ImagoMundi
from imago_mundi_app.serializers import ImagoMundiSerializer


class ImagoMundiViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = ImagoMundi.objects.all()
    serializer_class = ImagoMundiSerializer

    filter_backends = (filters.SearchFilter,)
    search_fields = ('shelfmark', 'date_from', 'date_until',
                     'current_location_country', 'current_location_town',
                     'place_of_origin',
                     'owner_and_location_1000_1100',
                     'owner_and_location_1100_1200',
                     'owner_and_location_1200_1300',
                     'owner_and_location_1300_1400',
                     'owner_and_location_1400_1500',
                     'owner_and_location_1500_1600',
                     'owner_and_location_1600_1700',
                     'owner_and_location_1700_1800',
                     'owner_and_location_1800_1900',
                     'owner_and_location_1900_2000',
                     'language', 'title', 'folia', 'text_type',
                     'chapters', 'incipit', 'explicit',
                     'attribution_of_author', 'decorations',
                     'manuscript_content', 'bibliography',
                     'notes')


def geocode(request):
    # geocode only fields that are still empty
    results = ImagoMundi.objects.filter(current_location_lat__isnull=True)
    success_message = 'The following addresses were succesfully geocoded: \n\n'
    warning_message = 'Geocoding did not succeed on the following addresses: \n\n'

    for result in results:
        try:
            geolocator = Nominatim(user_agent="ImagoMundi")
            location = geolocator.geocode(result.address_current_location)
            print(location.address)
            print((location.latitude, location.longitude))
            result.current_location_lat = location.latitude
            result.current_location_lng = location.longitude
            result.save()
            success_message += ' ' + result.address_current_location + ' * '

        except:
            warning_message += ' ' + result.address_current_location + ' *  '

    messages.add_message(request, messages.INFO, success_message)
    messages.warning(request, warning_message)
    return redirect(request.META['HTTP_REFERER'])


def get_api_key(request):
    return JsonResponse({'value': settings.GMAPS_APIKEY})