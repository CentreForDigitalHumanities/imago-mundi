import { extend } from 'lodash';
import Collection from '../core/collection';
import ImagoMundiModel from './imagomundi-model'

export default class ImagoMundiCollection extends Collection {
}

extend(ImagoMundiCollection.prototype, {
    url: 'http://localhost:8000/api/imagomundi/',
    model: ImagoMundiModel,
});
