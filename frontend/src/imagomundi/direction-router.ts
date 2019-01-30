import { extend } from 'lodash';

import Router from '../core/router';

export default class DirectionRouter extends Router { } //constructor met prototype

extend(DirectionRouter.prototype, { //dit is de naam van de constructor
    routes: {
        '(search)': 'search',
        'arrive': 'arrive', // tussen brackes betekent blijkbaar dat hij redirect naar deze
        'leave': 'leave',
        'testrobert': 'testrobert',
    },
});// dit is een object met properties
// extend  breidt de prototype van de directionRouter uit met de properties van het object.
