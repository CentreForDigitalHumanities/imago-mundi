import View from '../core/view';
import testrobertTemplate from './testrobert-template';

export default class EnterView extends View {
    template = testrobertTemplate;

    initialize() {
        //dit is je constructor
        // heeft parameter options is een object

        //hier kan je een new maken
        //bv
        //searchboxview= new searchBoxView();
    }


    render() {
        this.$el.html(this.template(this.model.toJSON()));// model bstaat omdat er al een object is doorgegegeven aan de constructor
        return this;
    }
}

//je mag hier een model class importeren en 
//