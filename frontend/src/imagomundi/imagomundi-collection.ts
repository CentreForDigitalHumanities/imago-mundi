import { extend } from 'lodash';
import Collection from '../core/collection';
import ImagoMundiModel from './imagomundi-model'
import { apiRoot } from 'config.json';

export default class ImagoMundiCollection extends Collection {
}

extend(ImagoMundiCollection.prototype, {
    url: apiRoot + 'imagomundi/',
    model: ImagoMundiModel,
});
