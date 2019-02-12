
import { extend, remove } from 'lodash';
import View from '../core/view';
import resultTemplate from './searchresult-template';
import searchTemplate from './search-template';
import Collection from '../core/collection';
import ImagoMundiCollection from './imagomundi-collection';

export default class SearchView extends View {
    template = searchTemplate;
    resultTemplate = resultTemplate;
    initialSearchCollection: Collection;
    filterOptionsCollection = new ImagoMundiCollection;
    current_location_countries: String[] = [];
    languages: String[] = [];
    table_keys: String[] = [];

    initialize() {
        this.listenTo(this.collection, 'update', this.update_searchresult); //als collection geupdated word,  method uitvoeren

    }


    showDetails() {
        alert('toon details');
    }


    search(event) { //waar komt even param vandaan?
        var self = this; // pass the class this as self, because jquery has its own this
        event.preventDefault();
        this.collection.fetch({
            data: { search: this.$('#search').val() },
            success: function (collection, response, options) { //de this.collection is hier al geupdated. Waarom wordt hij als parameter meegegeven?

                self.initialSearchCollection = new Collection(collection.models);// dit is nodig omdat in javascript by reference wordt doorgegeven
                // je kan dus niet zeggen self.initialSearchCollection=collection, dan is dat nl ook een referentie, 
                // en verandert hij mee met de waarde van de collection

                self.applyFilters();// geeft "this is undefined" Searchview.filter() werkt ook niet, via self =this lukt het wel

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

    //just once called from imagomundi.ts, get collection to create dynamically the filter select options, and append the template
    render() {
        var self = this;
        this.filterOptionsCollection.fetch({
            success: function (filterOptionsCollection, response, options) {
                //filter unique on language and countrylocation 
                self.current_location_countries = _.uniq(filterOptionsCollection.pluck("current_location_country"));//select attribute and keep unique
                self.current_location_countries = remove(self.current_location_countries, function (n) { return n != ""; });//remove empty
                self.current_location_countries.sort();

                self.languages = _.uniq(filterOptionsCollection.pluck("language"));
                self.languages = remove(self.languages, function (n) { return n != ""; });//remove empty
                self.languages.sort();
                self.table_keys = self.filterOptionsCollection.at(1).attributes;

                self.$el.html(self.template({
                    countries_select: self.current_location_countries,
                    languages_select: self.languages,
                    //table_keys: self.table_keys //werkt, maar tabel veel te breed, moet onder elkaar
                }));

            },
            error: function (collection, response, options) {
                console.log("error");
            }
        });

        return this;
    }

    update_searchresult() {
        this.$('#searchresult').html(this.resultTemplate({ results: this.collection.toJSON() })); //$el is gewoon vervangen door dit element
        this.$('#countresult').html("number of results: " + this.collection.toJSON().length);
        // this.$('#keys').html(this.collection.at(1).toJSON());
        // console.log(this.collection.at(1).toJSON());
    }
}

extend(SearchView.prototype, {
    template: searchTemplate,
    events: {
        'click #search_button': 'search',
        'click #current_location_country': 'applyFilters',
        'click #language': 'applyFilters',
        'click #date_from': 'applyFilters',
        'click #date_until': 'applyFilters',
        'click .details': 'showDetails',
    },
});
