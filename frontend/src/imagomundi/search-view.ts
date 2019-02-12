import { extend } from 'lodash';
import View from '../core/view';
import resultTemplate from './searchresult-template';
import searchTemplate from './search-template';
import Collection from '../core/collection';

export default class SearchView extends View {
    template = searchTemplate;
    resultTemplate = resultTemplate;
    initialSearchCollection: Collection;


    initialize() {
        this.listenTo(this.collection, 'update', this.update_searchresult); //als collection geupdated word,  method uitvoeren
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

    //only once called from imagomundi.ts
    render() {
        this.$el.html(this.template({ results: this.collection.toJSON() }));// werkt maar vervangt hele template, collectie meesturen niet meer nodig?
        return this;
    }

    update_searchresult() {
        this.$('#searchresult').html(this.resultTemplate({ results: this.collection.toJSON() })); //$el is gewoon vervangen door dit element
        this.$('#countresult').html("number of results: " + this.collection.toJSON().length);
    }
}

extend(SearchView.prototype, { //w
    template: searchTemplate,
    events: {
        'click #search_button': 'search',

        'click #current_location_country': 'applyFilters',

        'click #language': 'applyFilters',

        'click #date_from': 'applyFilters',

        'click #date_until': 'applyFilters',
    },
});
