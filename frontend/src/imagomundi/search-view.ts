
import { extend, remove } from 'lodash';
import View from '../core/view';
import resultTemplate from './searchresult-template';
import searchTemplate from './search-template';
import Collection from '../core/collection';
import ImagoMundiCollection from './imagomundi-collection';
import detailsTemplate from './details-template';
import { Model } from 'backbone';
//import mapTemplate from './map-template'; gaat niet werken, moet vanuit typescript zelf
//import { createClient, GoogleMapsClient, google } from '@google/maps';
// declare var google;
// import { google } from "google-maps";
// import { } from '@types/googlemaps'; //wordt niet herkend dit moet nog: Add typeroots to your  tsconfig.json



export default class SearchView extends View {
    template = searchTemplate;
    resultTemplate = resultTemplate;
    detailsTemplate = detailsTemplate;
    //mapTemplate = mapTemplate;
    initialSearchCollection: Collection;
    filterOptionsCollection = new ImagoMundiCollection;
    current_location_countries: String[] = [];
    place_of_origin_country: String[] = [];
    languages: String[] = [];
    table_keys: String[] = [];
    showdetails: boolean = false;
    id_last: Number;
    detailsmodel: Model;
    //intervalId: any;
    // map: any; werkt niet om het global te maken, herkent de methods niet meer
    // geocoder: any;

    //googleMapsClient: GoogleMapsClient; dit werkt, maar is geen maps
    //google: google;

    //Todo: het typen van google lukt dus nog niet. 

    initialize() {
        this.listenTo(this.collection, 'update', this.update_searchresult); //als collection geupdated word,  method uitvoeren
    }


    //dit werkt. Probleem is nog dat de objecten niet door typescript als types worden herkend, dus ik kan ze enkel als parameters doorgeven. Hoe anders?
    // initMap() {
    //     // var map = new google.maps.Map(document.getElementById("map"), { werkt ook
    //     var map = new google.maps.Map($('#map').get(0), { //this is er van af, enkel dan herkent hij hem, waarschijnlijk omdat hij nu in de index staat. Todo: verplaatsen
    //         zoom: 4, //lager is verder weg
    //         center: { lat: 51.4, lng: 11.4 }
    //     });

    //     var geocoder = new google.maps.Geocoder();
    //     this.geocodeCurrentAddress(geocoder, map);
    // }

    //general map
    geocodeCurrentAddress() {

        // var map = new google.maps.Map(document.getElementById("map"), { werkt ook
        var map = new google.maps.Map($('#map').get(0), { //this is er van af, enkel dan herkent hij hem, waarschijnlijk omdat hij nu in de index staat. Todo: verplaatsen
            zoom: 4, //lager is verder weg
            center: { lat: 51.4, lng: 11.4 }
        });

        var geocoder = new google.maps.Geocoder();
        var addresses = [];
        var geocode_max = 12;
        var addresses_all = _.uniq(this.collection.pluck("address_current_location"));
        addresses_all = remove(addresses_all, function (n) { return n != ""; });//remove empty

        //Geocoding API: 50 requests per second (QPS), calculated as the sum of client-side and server-side queries.
        //aantal adressen dus beperken.
        //een max aantal is ook nog niet voldoende, schijnt dat het niet te snel achter elkaar mag. Daarom ook een timeout erin
        if (addresses_all.length < geocode_max) {
            geocode_max = addresses_all.length;
        }

        for (let k = 0; k < geocode_max; k++) {
            addresses.push(addresses_all[k]);
        };

        //Iteration via set interval method, api call every so many miliseconds to prevent google limit. Interval stops when address.lenght is reached
        let i = 0;
        let intervalIdCurrent = setInterval(function () {

            let address = addresses[i]

            geocoder.geocode({ 'address': address }, function (results, status) {

                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
                    //dit is nog lastig, want hij zet hem dus op het laatste resultaat van de loop
                    //https://stackoverflow.com/questions/15719951/auto-center-map-with-multiple-markers-in-google-maps-api-v3

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: results[0].formatted_address
                    });

                    // console.log('teller:')
                    // console.log(i)
                    // console.log('resultaat:')
                    // console.log(results)

                    var infowindow = new google.maps.InfoWindow({
                        content: results[0].formatted_address //todo, ook de titel en shelfmark meegeven, hoe als er meerder manuscripten zijn?
                    });

                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            infowindow.open(map, marker);
                        }
                    })(marker, i));

                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            }
            );//geocode

            if (i === addresses.length - 1) {
                clearInterval(intervalIdCurrent);
            }
            i++;
        }, 200);//set interval
    }


    //details map
    geocodeHistoricalAddress(detailsmodel) {
        var map = new google.maps.Map($('#map_historical_addresses').get(0), {
            zoom: 5, //lower is a higher view
            center: { lat: 51.4, lng: 11.4 }
        });
        let bounds = new google.maps.LatLngBounds();
        let geocoder = new google.maps.Geocoder();
        var location_data = [];
        let last_location_geocoding_lat;
        let last_location_geocoding_lng;
        let residence_duration = 100;
        let last_date_from;
        let last_icon;
        let date_from;
        let date_until;
        let icon_width = 40;
        let icon_height = 40;

        var addresses_all = [
            detailsmodel['owner_and_location_1000_1100'],
            detailsmodel['owner_and_location_1100_1200'],
            detailsmodel['owner_and_location_1200_1300'],
            detailsmodel['owner_and_location_1300_1400'],
            detailsmodel['owner_and_location_1400_1500'],
            detailsmodel['owner_and_location_1500_1600'],
            detailsmodel['owner_and_location_1600_1700'],
            detailsmodel['owner_and_location_1700_1800'],
            detailsmodel['owner_and_location_1800_1900'],
            detailsmodel['owner_and_location_1900_2000'],
            detailsmodel['address_current_location']
        ];

        var periods = [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 'Current Location'];
        var marker_icons = [
            'http://maps.google.com/mapfiles/ms/icons/purple.png',
            'http://maps.google.com/mapfiles/ms/icons/purple.png',
            'http://maps.google.com/mapfiles/ms/icons/blue.png',
            'http://maps.google.com/mapfiles/ms/icons/blue.png',
            'http://maps.google.com/mapfiles/ms/icons/lightblue.png',
            'http://maps.google.com/mapfiles/ms/icons/lightblue.png',
            'http://maps.google.com/mapfiles/ms/icons/green.png',
            'http://maps.google.com/mapfiles/ms/icons/green.png',
            'http://maps.google.com/mapfiles/ms/icons/orange.png',
            'http://maps.google.com/mapfiles/ms/icons/orange.png',
            'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'
        ];

        for (let k = 0; k < addresses_all.length; k++) {
            if (addresses_all[k] != null && addresses_all[k] != '?' && addresses_all[k] != '-' && addresses_all[k] != '') {
                location_data.push({ 'address': addresses_all[k], 'period': periods[k], 'icon': marker_icons[k] });
            }
        };

        //Iteration via set interval method, api call every so many miliseconds to prevent google limit, and create animation. 
        //Interval stops when address.lenght is reached
        let i = 0;

        let intervalId2 = setInterval(function () {
            let address;

            //last location is current location, somewhat larger icon
            if (i == (_.size(location_data) - 1)) {
                icon_width = 45;
                icon_height = 50;
            }

            //idee: omdat locaties vaak dicht bij elkaar liggen, kan ook de bibliotheek worden gebruikt bij geocoding, maar dan moet de dubbele punt door komma 
            //worden vervangen Austria, Vienna, Hofbibliothek. 
            //Largo Porta Sant'Agostino, 337, 41121 Modena MO, Italy vind hij niet.

            console.log('i voor if:')
            console.log(i);

            if (i < (_.size(location_data))) {

                console.log('i en size locationdata:')
                console.log(i);
                console.log(_.size(location_data));
                //probleem blijkt: hij houdt niet altijd de volgorde aan. Het is async, dus gaat soms een latere locatie eerder, waardoor optelling niet meer klopt
                address = location_data[i].address;

                geocoder.geocode({ 'address': address }, function (results, status) {

                    if (status === 'OK') {

                        //add up the time periods if the manuscript stayed on one location during several periods
                        if (results[0].geometry.location.lat() == last_location_geocoding_lat && results[0].geometry.location.lng() == last_location_geocoding_lng) { //compare locations
                            residence_duration = residence_duration + 100;
                            date_until = residence_duration + last_date_from;
                            date_from = last_date_from;
                            icon = last_icon;
                            //prevent obvious wrongly calculated date
                            if (date_until > 2000) {
                                date_until = 2000;
                            }
                        }
                        else {
                            residence_duration = 100;
                            date_until = location_data[i].period + residence_duration;
                            date_from = location_data[i].period;
                            icon = location_data[i].icon;
                        }

                        //for current location, icon is always a special one.
                        if (i == (_.size(location_data) - 1)) {
                            icon = location_data[i].icon;
                        }

                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            title: results[0].formatted_address,
                            icon: { url: icon, scaledSize: new google.maps.Size(icon_width, icon_height), },
                            zIndex: i //i as increasing index, current location must be on top
                        });

                        let loc = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                        map.setCenter(loc);
                        bounds.extend(loc);

                        if (location_data[i].period == 'Current Location') {
                            date_from = 'Current Location';
                            date_until = '';
                        }

                        var infowindow = new google.maps.InfoWindow({
                            content: date_from + " - " + date_until + " : " + results[0].formatted_address,// hij blijft hier soms zeggen dat niet defined, waarom? Blijkt niet altijd in volgeorde te geocoden
                        });

                        //infowindow.open(map, marker);
                        google.maps.event.addListener(marker, 'click', (function (marker) {
                            return function () {
                                infowindow.open(map, marker);
                            }
                        })(marker));

                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }

                    //for use in next loop to compare with new location set last geolocation
                    last_location_geocoding_lat = results[0].geometry.location.lat();
                    last_location_geocoding_lng = results[0].geometry.location.lng();
                    last_date_from = date_from;
                    last_icon = icon;

                    i++; //add only if there was geocoding, its async!

                    map.fitBounds(bounds);
                    map.panToBounds(bounds);
                }
                );//geocode
            }//if

            if (i >= _.size(location_data) - 1) {
                clearInterval(intervalId2);
                console.log('gestopt en markers:');
                console.log(bounds);
            }
        }, 250);//set interval

        var legend = document.getElementById('legend_historical_addresses');
        for (var key in location_data) {
            var period = location_data[key].period;
            var icon = location_data[key].icon;
            var until;
            if (period != 'Current Location') {
                until = "-" + parseInt(period + 100);
            }
            else { until = '' }
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + period + until;
            legend.appendChild(div);
        }

    }





    search(event) {
        var self = this; // pass the class this as self, because jquery has its own 'this'
        event.preventDefault();
        this.collection.fetch({
            data: { search: this.$('#search').val() },
            success: function (collection, response, options) { //de this.collection is hier al geupdated. Waarom wordt hij als parameter meegegeven?

                self.initialSearchCollection = new Collection(collection.models);// dit is nodig omdat in javascript by reference wordt doorgegeven
                // je kan dus niet zeggen self.initialSearchCollection=collection, dan is dat nl ook een referentie, 
                // en verandert hij mee met de waarde van de collection
                self.applyFilters();
            },
            error: function (collection, response, options) {
                console.log("error");
            }
        });
    }


    applyFilters() {
        this.collection.set(this.initialSearchCollection.models);//first reset to original collection
        this.filterCountryLanguage();
        this.filterDates();
        this.filterPlaceOfOriginCountry();
        this.geocodeCurrentAddress();
        return this.collection.toJSON();
    }

    //todo: heeft weinig zin meer om de where zo complex te hebben met een and, kan net zo goed twee aparte functies voor country en language maken die collectie opnieuw setten
    filterCountryLanguage() {
        var current_location_country_value = this.$("#current_location_country").val();
        var language_value = this.$("#language").val();
        var criteria = {};

        if (current_location_country_value != '') {
            Object.assign(criteria, { current_location_country: current_location_country_value });
        }

        if (language_value != '') {
            Object.assign(criteria, { language: language_value });
        }

        this.collection.set(this.collection.where(criteria));
    }


    filterDates() {
        let date_from_value = this.$("#date_from").val();
        let date_until_value = this.$("#date_until").val();

        if (date_from_value != '' || date_until_value != '') {
            if (date_from_value == '') {
                date_from_value = '0';
            }
            if (date_until_value == '') {
                date_until_value = '2100';
            }

            this.collection.set(
                _.filter(this.collection.models, function (model) { return model.get('date_from') > date_from_value && model.get('date_until') < date_until_value; })
            );
        }
    }

    filterPlaceOfOriginCountry() {
        var place_of_origin_country_value = this.$("#place_of_origin_country").val();
        if (place_of_origin_country_value != '') {
            this.collection.set(this.collection.where({ place_of_origin_country: place_of_origin_country_value }));
        }
    }


    //just once called from imagomundi.ts, get collection to create dynamically the filter select options, and append the template
    render() {
        var self = this;
        //async call 
        this.filterOptionsCollection.fetch({
            success: function (filterOptionsCollection, response, options) {
                //filter unique on language and countrylocation 
                self.prepareCountriesFilter();
                self.prepareLanguagesFilter();
                self.preparePlacesOfOriginFilter();

                self.$el.html(self.template({
                    countries_select: self.current_location_countries,
                    languages_select: self.languages,
                    countries_of_origin_select: self.place_of_origin_country,
                    addresses: ['address1', 'addres2'],
                }));

            },
            error: function (collection, response, options) {
                console.log("error");
            }


        });

        return this;
    }

    prepareCountriesFilter() {
        this.current_location_countries = _.uniq(this.filterOptionsCollection.pluck("current_location_country"));//select attribute and keep unique
        this.current_location_countries = remove(this.current_location_countries, function (n) { return n != ""; });//remove empty
        this.current_location_countries.sort();
    }

    prepareLanguagesFilter() {
        this.languages = _.uniq(this.filterOptionsCollection.pluck("language"));
        this.languages = remove(this.languages, function (n) { return n != ""; });//remove empty
        this.languages.sort();
    }

    preparePlacesOfOriginFilter() {
        this.place_of_origin_country = _.uniq(this.filterOptionsCollection.pluck("place_of_origin_country"));//select attribute and keep unique
        this.place_of_origin_country = remove(this.place_of_origin_country, function (n) { return n != ""; });//remove empty
        this.place_of_origin_country.sort();
    }

    //get unique adresses en put them in array for google map
    // prepareAddresses() {
    //     var addresses = _.uniq(this.collection.pluck("address_current_location"));
    //     addresses = remove(addresses, function (n) { return n != ""; });//remove empty

    //     console.log(addresses)
    // }

    update_searchresult() {
        this.$('#searchresult').html(this.resultTemplate({ results: this.collection.toJSON() }));
        this.$('#countresult').html("N = " + this.collection.toJSON().length);
        this.$('#titlebox').hide();//hide title to have more room for table

    }


    showDetails(event) {
        event.stopPropagation();// to prevent event bubbling: the parent elements must not be affected
        var id = parseInt(event.currentTarget.id);//id is passed as string but is an int in collection
        this.$('#' + this.id_last).removeClass("link_open");// 

        if (this.showdetails == false || id != this.id_last) {
            this.showdetails = true;
            this.detailsmodel = JSON.parse(JSON.stringify(this.collection.where({ id: id })));//json.parse turns json in an object
            this.$('#showdetails').html(this.detailsTemplate({ detailsmodel: this.detailsmodel[0] }));//object is multidimensional, so go one layer deeper
            this.$('#' + id).addClass("link_open");
        }
        else {
            this.closeDetails(event);
        }


        this.id_last = id;
    }

    closeDetails(event) {
        //close details screen, but not when is clicked on table itself
        if (event.target.className != '' && event.target.className != 'cell_content' && event.target.className != 'cell_title' && event.target.className != 'link_tab') {
            this.$('#showdetails').empty();
            this.showdetails = false;
            this.$('#' + this.id_last).removeClass("link_open");// 
        }
        //console.log(event.target.className);
    }


    showHelp(event) {
        event.preventDefault();
        this.$('.modal').addClass("is-active");
    }


    closeHelp(event) {
        event.preventDefault();
        this.$('.modal').removeClass("is-active");
    }

    resetFilters(event) {
        event.preventDefault();
        $('#language').prop('selectedIndex', 0);
        $('#current_location_country').prop('selectedIndex', 0);
        $('#place_of_origin_country').prop('selectedIndex', 0);
        $('#date_from').prop('selectedIndex', 0);
        $('#date_until').prop('selectedIndex', 0);
        this.applyFilters();
        //console.log('reset button')
    }

    changeTabs(event) {
        var id = event.currentTarget.id;

        //first hide all content, remove is-active from tab
        this.$('.content-tab').each(function (index, element) {
            $(element).hide();
        });
        this.$('.tab').each(function (index, element) {
            $(element).removeClass("is-active");
        });

        if (id == 'link_tab_content') {
            this.$('#tab_content').show();
            this.$('#li_content').addClass("is-active");// wordt wel gevonden
        }
        if (id == 'link_tab_details') {
            this.$('#tab_details').show();
            this.$('#li_details').addClass("is-active");
        }
        if (id == 'link_tab_location') {
            this.$('#tab_location').show();
            this.$('#li_location').addClass("is-active"); //lijkt niet te vinden

            this.geocodeHistoricalAddress(this.detailsmodel[0]);
        }
    }

    //to trigger event when enter key is pressed
    filterEnterKey(event) {
        if (event.which == 13) {
            this.search(event);
        }
    }

}


//:not(.modal-imagomundi) werkte niet
extend(SearchView.prototype, {
    template: searchTemplate,
    events: {
        'click #search_button': 'search',
        'keypress #search': 'filterEnterKey',
        'change #current_location_country': 'applyFilters',
        'change #place_of_origin_country': 'applyFilters',
        'change #language': 'applyFilters',
        'change #date_from': 'applyFilters',
        'change #date_until': 'applyFilters',
        'click .details': 'showDetails',
        'click #help_button': 'showHelp',
        'click #close_button': 'closeHelp',
        'click .hero': 'closeDetails',
        'click .title': 'closeDetails',
        'click .modal-background': 'closeHelp',
        'click #reset_button': 'resetFilters',
        'click .link_tab': 'changeTabs',

    },
});
