from imago_mundi_app.models import ImagoMundi
from rest_framework import serializers


class ImagoMundiSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImagoMundi
        fields = ('id', 'shelfmark', 'date_from', 'date_until',
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
                  'notes'
                  )
