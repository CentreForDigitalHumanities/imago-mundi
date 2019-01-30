import View from '../core/view';
import headerTemplate from './header-template';

export default class SearchView extends View {
    template = headerTemplate;

    initialize() {
        //dit is je constructor
        // heeft parameter options is een object
        //hier kan je een new maken
        //bv
        //searchboxview= new searchBoxView();
    }


    render() {

        this.$el.html(this.template({}));// er moet een lege {} worden megegeven anders fout, object is: var person={firstname:John,} is een soort associative array
        return this;
    }
}

//je mag hier een model class importeren en 
//