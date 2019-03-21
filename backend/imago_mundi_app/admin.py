import tablib
from django.contrib import admin
from import_export import resources
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin
from imago_mundi_app.models import ImagoMundi
from collections import OrderedDict
import string
from django.http import HttpResponseRedirect
from django import template


class ImagoMundiResource(resources.ModelResource):
    # attribute is de naam in het model, Columnname is van de import
    # gebruikt nu dus eigenlijk de method 'fields' van import_export class?
    shelfmark = Field(column_name='Shelfmark', attribute="shelfmark")
    date_from = Field(column_name='date_from', attribute="date_from")
    date_until = Field(column_name='date_until', attribute="date_until")
    current_location_country = Field(
        column_name='current_location_country', attribute="current_location_country")
    current_location_town = Field(
        column_name='current_location_town', attribute="current_location_town")

    # 7 maart
    place_of_origin_country = Field(column_name='place_of_origin_country',
                                    attribute="place_of_origin_country")
    place_of_origin_town = Field(column_name='place_of_origin_town',
                                 attribute="place_of_origin_town")

    # nieuw
    address_current_location = Field(
        column_name='Address current location', attribute="address_current_location")

    place_of_origin = Field(column_name='Place of origin',
                            attribute="place_of_origin")

    owner_and_location_1000_1100 = Field(
        column_name='Owner and location 1000-1100', attribute="owner_and_location_1000_1100")
    owner_and_location_1100_1200 = Field(
        column_name='Owner and location 1100-1200', attribute="owner_and_location_1100_1200")
    owner_and_location_1200_1300 = Field(
        column_name='Owner and location 1200-1300', attribute="owner_and_location_1200_1300")
    owner_and_location_1300_1400 = Field(
        column_name='Owner and location 1300-1400', attribute="owner_and_location_1300_1400")
    owner_and_location_1400_1500 = Field(
        column_name='Owner and location 1400-1500', attribute="owner_and_location_1400_1500")
    owner_and_location_1500_1600 = Field(
        column_name='Owner and location 1500-1600', attribute="owner_and_location_1500_1600")
    owner_and_location_1600_1700 = Field(
        column_name='Owner and location 1600-1700', attribute="owner_and_location_1600_1700")
    owner_and_location_1700_1800 = Field(
        column_name='Owner and location 1700-1800', attribute="owner_and_location_1700_1800")
    owner_and_location_1800_1900 = Field(
        column_name='Owner and location 1800-1900', attribute="owner_and_location_1800_1900")
    owner_and_location_1900_2000 = Field(
        column_name='Owner and location 1900-2000', attribute="owner_and_location_1900_2000")
    language = Field(column_name='Language', attribute="language")
    title = Field(column_name='Title', attribute="title")
    folia = Field(column_name='Folia', attribute="folia")
    text_type = Field(column_name='Text type', attribute="text_type")
    chapters = Field(column_name='Chapters', attribute="chapters")
    incipit = Field(column_name='Incipit', attribute="incipit")
    explicit = Field(column_name='Explicit', attribute="explicit")
    attribution_of_author = Field(
        column_name='Attribution of author', attribute="attribution_of_author")
    decorations = Field(column_name='Decorations', attribute="decorations")

    # nieuw
    images = Field(
        column_name='Images', attribute="images")

    manuscript_content = Field(
        column_name='Manuscript content', attribute="manuscript_content")
    bibliography = Field(column_name='Bibliography', attribute="bibliography")
    notes = Field(column_name='Notes', attribute="notes")

    class Meta:  # for adding attributes
        model = ImagoMundi
        # fields = ['shelfmark', 'date_from', 'current_location_country']
        exclude = ('id', 'created_date')
        to_encoding = 'utf-8'  # export data encoding
        from_encoding = 'utf-8'  # import data encoding

    def before_import(self, dataset, using_transactions, dry_run=False, **kwargs):

        # inserts the missing id column
        if 'id' not in dataset.headers:
            dataset.insert_col(0, col=["", ]*dataset.height, header="id")

        # insert new columns that are not in Excellsheet, to split columns in more usefull ones for search operations
        dataset.insert_col(1, col=["", ]*dataset.height, header="date_from")
        dataset.insert_col(2, col=["", ]*dataset.height, header="date_until")
        dataset.insert_col(3, col=["", ]*dataset.height,
                           header="current_location_country")
        dataset.insert_col(4, col=["", ]*dataset.height,
                           header="current_location_town")

        # 7maart
        dataset.insert_col(5, col=["", ]*dataset.height,
                           header="place_of_origin_country")
        dataset.insert_col(6, col=["", ]*dataset.height,
                           header="place_of_origin_town")

    # override this method, to enable extra row headers

    def get_instance(self, instance_loader, row):
        return False

    def before_import_row(self, row, **kwargs):

        for (key, value) in row.items():
            value = str(value)
            # loop for replacing not recognized utf characters that are in import which cause errors
            for r in (("\u2026", "..."), ("\u2013", "-"), ("\u010c", "C"),
                      ("\u011b", "e"), ("\u016f", "u"), ("\xc1", "A"),
                      ("\u0158", "R"), ("\u0159", "r"), ("\u2019", "'"),
                      # TODO Beta teken nog een probleem, voorlopig zo
                      ("\u0153", "oe"), ("\u02da", ""), ("\u03b2", "B"),
                      ("\u0169", "u"), ("\u0303", "~"), ("\u204a", "&"),
                      ):
                value = value.replace(*r)

            row[key] = value

        # split date in two columns. In before_import method already there are these extra columns inserted
        #date = row['Date']
        date_split = row['Date'].split("-")
        if len(date_split) > 1:
            date_until = date_split[1]
        else:
            date_until = date_split[0]

        # split current location in two columns. In before_import method already there are these extra columns inserted
        location_split = row['Current location'].split(",")
        if len(location_split) > 1:
            current_location_town = location_split[1]
        else:
            current_location_town = ""

        # 7 maart split place of origin in two columns. In before_import method already there are these extra columns inserted
        place_of_origin_split = row['Place of origin'].split(",")
        if len(place_of_origin_split) > 1:
            place_of_origin_town = place_of_origin_split[1]
        else:
            place_of_origin_town = ""

        row.update({'date_from': date_split[0], 'date_until': date_until,
                    'current_location_country': location_split[0], 'current_location_town': current_location_town,
                    # 7maart
                    'place_of_origin_country': place_of_origin_split[0], 'place_of_origin_town': place_of_origin_town
                    })

        # print(row)


# doet zelfde als admin.site.register


@admin.register(ImagoMundi)
class ImagoMundiAdmin(ImportExportModelAdmin):

    resource_class = ImagoMundiResource
    # override list template , with one that has a button to geocode. This triggers code in views.py
    change_list_template = "../templates/admin/change_list.html"

    # meest duidelijk
    # http://books.agiliq.com/projects/django-admin-cookbook/en/latest/action_buttons.html

    # def get_urls(self):
    #     from django.conf.urls import url
    #     urls = super(ImagoMundiAdmin, self).get_urls()
    #     urls += [
    #         # was path in voorbeeld, is oud?
    #         # hij herkent dit blijkbaar niet. Of moet er toch iets bij urls.py?
    #         url(r'^geocode/$', self.geocode_current_address),
    #     ]
    #     return urls

    # def geocode_current_address(self, request):
    #     print(request)
    #     print('test')
    #     self.message_user(request, "geocoded")
    #     return HttpResponseRedirect("../")

    # actions = ['geocode_current_address']

    # def geocode_current_address(self, request, queryset):
    #     print(request)
    #     print('test')


# deze aanroepen via form met button

#actions = ['geocode_current_address']

# dit elimineert were de import functie. du via de class ImagoMundiAdmin?


# class GeocodeAdmin(admin.ModelAdmin):
#     # in form: <input type="hidden" name="action" value="geocode_current_address" />
#     actions = ['geocode_current_address']

#     def geocode_current_address(self, request, queryset):
#         print(request)
#         print('test')
    # of doen zaosl met normale views
    # https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Forms

    # meest duidelijk
    # http://books.agiliq.com/projects/django-admin-cookbook/en/latest/action_buttons.html


# admin.site.unregister(ImagoMundi)
#admin.site.register(ImagoMundi, GeocodeAdmin)
