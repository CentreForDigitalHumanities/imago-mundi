from django.shortcuts import render
from rest_framework import viewsets
from imago_mundi_app.models import ImagoMundi
from imago_mundi_app.serializers import ImagoMundiSerializer
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework import filters
from django.contrib.postgres.search import SearchQuery
from django.shortcuts import redirect
from geopy.geocoders import Nominatim
from django.contrib import messages
import logging
import os

# Create your views here.


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
    # tijdelijk
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    template_dir = os.path.join(base_dir, 'templates')
    # print('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    # print('template_dir:')
    # print(template_dir)
    # print('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

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

    # logger = logging.getLogger(__name__)
    logging.basicConfig(filename='geocode.log', level=logging.CRITICAL)
    logging.critical(
        'Template dir ################################################################################################################:')
    logging.critical(template_dir)

    # return to same page
    return redirect(request.META['HTTP_REFERER'])
