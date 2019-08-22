from django.db import models
from django.utils import timezone
# Create your models here.


class ImagoMundi(models.Model):
    shelfmark = models.TextField(null=True, blank=True)
    date_from = models.CharField(max_length=100, null=True, blank=True)
    date_until = models.CharField(max_length=100, null=True, blank=True)
    current_location_country = models.CharField(
        max_length=200, null=True, blank=True)
    current_location_town = models.CharField(
        max_length=200, null=True, blank=True)
    address_current_location = models.TextField(null=True, blank=True)
    place_id = models.CharField(
        max_length=200, null=True, blank=True)
    current_location_lat = models.CharField(
        max_length=200, null=True, blank=True)
    current_location_lng = models.CharField(
        max_length=200, null=True, blank=True)
    place_of_origin = models.TextField(null=True, blank=True)
    place_of_origin_country = models.CharField(
        max_length=200, null=True, blank=True)
    place_of_origin_town = models.CharField(
        max_length=200, null=True, blank=True)
    owner_and_location_1000_1100 = models.TextField(null=True, blank=True)
    owner_and_location_1100_1200 = models.TextField(null=True, blank=True)
    owner_and_location_1200_1300 = models.TextField(null=True, blank=True)
    owner_and_location_1300_1400 = models.TextField(null=True, blank=True)
    owner_and_location_1400_1500 = models.TextField(null=True, blank=True)
    owner_and_location_1500_1600 = models.TextField(null=True, blank=True)
    owner_and_location_1600_1700 = models.TextField(null=True, blank=True)
    owner_and_location_1700_1800 = models.TextField(null=True, blank=True)
    owner_and_location_1800_1900 = models.TextField(null=True, blank=True)
    owner_and_location_1900_2000 = models.TextField(null=True, blank=True)
    language = models.CharField(max_length=100, null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    folia = models.CharField(max_length=100, null=True, blank=True)
    text_type = models.CharField(max_length=100, null=True, blank=True)
    # 22-8-19 from charfield to textfield
    chapters = models.TextField(null=True, blank=True)

    incipit = models.TextField(null=True, blank=True)
    explicit = models.TextField(null=True, blank=True)

    # 22-8-19 from charfield to textfield
    attribution_of_author = models.TextField(null=True, blank=True)

    decorations = models.TextField(null=True, blank=True)
    manuscript_content = models.TextField(null=True, blank=True)
    images = models.TextField(null=True, blank=True)
    bibliography = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.title + ' - ' + self.shelfmark)
