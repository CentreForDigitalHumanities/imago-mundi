import { extend } from 'lodash';

import View from '../core/view';

import resultTemplate from './searchresult-template';
import searchTemplate from './search-template';
import ImagoMundiCollection from './imagomundi-collection';
import { Collection } from 'underscore';
import ImagoMundiModel from './imagomundi-model';
//import Collection from '../core/collection';


export default class SearchView extends View {
    template = searchTemplate;
    resultTemplate = resultTemplate;

    initialize() {
        //dit is je constructor
        this.listenTo(this.collection, 'update', this.update_searchresult); //als collection geupdated word,  method uitvoeren
    }

    search(event) { //waar komt even param vandaan?
        var self = this; // oplossing: de this van de class wordt als self doorgegeven
        event.preventDefault();
        this.collection.fetch({
            data: { search: this.$('#search').val() },
            success: function (collection, response, options) { //de this.collection is hier al geupdated. Waarom wordt hij als parameter meegegeven?
                //console.log(collection.where({ texttype: "Fragment" }));
                //console.log(collection.filter({ language: 'Welsh' }));
                //console.log(collection);

                self.applyFilters();// geeft "this is undefined" Searchview.filter() werkt ook niet, via self =this lukt het wel

                //this.$el.searchresult(collection);
                //this.searchresult = collection;
                //console.log(collection);
                //console.log(response);
                //console.log(collection.filter({ language: 'Welsh' }));

                // console.log(collection.where({ language: this.$("current_location_country").val() })); werkt niet, warschijnlijk omdat de elementen van de dom hier onbekend zijn
                //self.searchresult = self.collection;
            },
            error: function (collection, response, options) {
                console.log("error");
                //console.log(collection);
            }
        });
    }


    applyFilters() {

        console.log(this.$("#current_location_country").val())
        console.log(this.$("#language").val())

        //console.log(this.collection.toJSON());
        var current_location_country_value = this.$("#current_location_country").val();
        var language_value = this.$("#language").val();
        let date_from_value = this.$("#date_from").val();
        let date_until_value = this.$("#date_until").val();


        if (current_location_country_value != '' || language_value != '') {
            //var filtered_on_country_language = this.collection.where(criteria);

            this.filterCountryLanguage();
        }
        //enkel uitvoeren als een jaartal is ingesteld, want er zijn ook entries zonder datum. Als dit filter standaard erop zit, worden die weggelaten

        if (date_from_value != '' || date_until_value != '') {

            this.filterDates();

        }


        return this.collection.toJSON(); // als filter niet is ingevuld, anders geen output


    }


    //TODO: probleem nu: de collectie wordt aangepast, en je bent als je filters weer weghaalt de oorspronkelijke kwijt. Die als reserve ergens opslaan en were gebruiken

    filterCountryLanguage() {
        var current_location_country_value = this.$("#current_location_country").val();
        var language_value = this.$("#language").val();
        var criteria = {};
        //object criteria vullen
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

        //Nog nodig? ja? functie boven wordt al in if gezet. Of daar altij uitvoeren?
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


    render() {
        //this.$el.html(this.template({ results: this.collection.toJSON() }));// hij rendert deze al in imagomundi.ts, werkt zonder filters
        this.$el.html(this.template({ results: this.applyFilters() }));// werkt maar vervangt hele template
        return this;
    }

    update_searchresult() {
        //this.$('#searchresult').html(this.resultTemplate(this.collection.toJSON())); Julian

        this.$('#searchresult').html(this.resultTemplate({ results: this.applyFilters() })); //$el is gewoon vervangen door dit element
        this.$('#countresult').html("number of results: " + this.applyFilters().length);

    }


}

//alles wat een attribute is hier, typescript heeft enkel methods
extend(SearchView.prototype, { //w
    template: searchTemplate,
    events: {
        'click #search_button': 'search',

        'click #current_location_country': 'update_searchresult',

        'click #language': 'filterCountryLanguage',

        'click #date_from': 'update_searchresult',

        'click #date_until': 'update_searchresult',
    },
});
