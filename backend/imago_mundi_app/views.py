from django.shortcuts import render
from rest_framework import viewsets
from imago_mundi_app.models import ImagoMundi
from imago_mundi_app.serializers import ImagoMundiSerializer
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework import filters
from django.contrib.postgres.search import SearchQuery

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

    # def get_queryset(self):
    #      # get variable ophalen
    #     searchterm = self.request.query_params.get('search')
    #     # print(searchterm)
    #     return ImagoMundi.objects.filter(language=searchterm)  # dit werkt

    # https://czep.net/17/full-text-search.html

    # The SearchFilter class will only be applied if the view has a search_fields attribute set. The search_fields attribute should be a list of names of text type fields on the model, such as CharField or TextField.
    # https://www.django-rest-framework.org/api-guide/filtering/

#     By default, searches will use case-insensitive partial matches. The search parameter may contain multiple search terms, which should be whitespace and/or comma separated. If multiple search terms are used then objects will be returned in the list only if all the provided terms are matched.
#     The search behavior may be restricted by prepending various characters to the search_fields.
#     '^' Starts-with search.
#     '=' Exact matches.
#     '@' Full-text search. (Currently only supported Django's MySQL backend.)
#     '$' Regex search.

# For example:

# search_fields = ('=username', '=email')

    #queryset = ImagoMundi.objects.filter(place_of_origin=searchterm)
