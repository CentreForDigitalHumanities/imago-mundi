import View from '../core/view';
import searchTemplate from './search-template';

export default class SearchView extends View {
    template = searchTemplate;

    initialize() {
        //dit is je constructor
        // heeft parameter options is een object
        //hier kan je een new maken
        //bv
        //searchboxview= new searchBoxView();
        // this.model.swapProperties(); //dit werkt ook, voert de method uit
        //console.log(this.model.swapProperties()) // dit werkt, hier komt het model binnen, want dat is doorgegeven toen het object werd gemaakt in global/im_search-view.ts

        //console.log(this.model.results_all())

        var results = this.collection.fetch();
        console.log(results)

        // results.then();

        this.collection.on('add', (model) => console.log(model));
        // this.collection[0];
        // this.collection[0].on('change:chapters', );
        // this.collection.filter({language: 'Welsh'});
        this.collection.fetch();


    }


    render() {
        //this.model.swapProperties(); //werkt ook
        //https://lostechies.com/derickbailey/2011/12/15/searching-with-a-backbonejs-collection/
        this.$el.html(this.template(this.collection.toJSON()));// er moet minstens een lege {} worden megegeven anders fout, object is: var person={firstname:John,} is een soort associative array
        return this;
    }
}

//je mag hier een model class importeren en 
//