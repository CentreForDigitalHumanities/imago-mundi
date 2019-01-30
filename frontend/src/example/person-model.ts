import FancyModel from '../core/fancy-model';

export default class ExampleModel extends FancyModel {
    defaults() {
        return {
            name: 'Robert',
            email: 'world@world.com',
            movie: 'District 9'
        };
    };

    swapProperties() {
        let temp = this.get('name');
        this.set('name', this.get('email'));
        this.set('email', temp);
        return this;
    }
}
