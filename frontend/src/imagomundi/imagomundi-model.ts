import { extend } from 'lodash';

import FancyModel from '../core/fancy-model';

export default class ImagoMundiModel extends FancyModel {
    defaults() {

        return {
            name: 'Robert',
            email: 'world@world.com',
            movie: 'District 9'
        };
    };

    results_all() {
        return 'test';
    }

    //url = 'http://localhost:8000/api/imagomundi/';
}

// extend(ImagoMundiModel.prototype, {
//     urlRoot: 'http://localhost:8000/api/imagomundi/',
// });
