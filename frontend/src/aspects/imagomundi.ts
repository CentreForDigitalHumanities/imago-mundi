import { history } from 'backbone';

import directionRouter from '../global/ex_direction-router';
import directionFsm from '../global/ex_direction-fsm';
import enterView from '../global/ex_enter-view';
import exitView from '../global/ex_exit-view';
import searchView from '../global/im_search-view';
import bannerView from '../global/ex_logoBanner';

import headerView from '../global/im_header-view';
//import testrobertView from '../global/ex_testrobert-view';

history.once('route', () => headerView.render().$el.appendTo('header')); //hier wordt de header view aan de body appended. Zie Backbone.history
//http://backbonejs.org/#History-start


directionRouter.on('route:search', () => searchView.render().$el.appendTo('main')); //via method in de view aan main appenden



directionRouter.on('route:arrive', () => directionFsm.handle('arrive'));//hier wordt een state gezet?
//directionRouter.on('route:arrive', () => enterView.render().$el.appendTo('main')); //test zonder states. blijkt: Je moet ook detachen, anders wordt hij onder de vorige toegevoegd

directionRouter.on('route:leave', () => directionFsm.handle('leave'));
//directionRouter.on('route:leave', () => exitView.render().$el.appendTo('main'));//test

//directionRouter.on('route:testrobert', () => directionFsm.handle('testrobert_fsm_arrive'));

directionFsm.on('enter:arriving', () => enterView.render().$el.appendTo('main')); //hier wordt de enter view in main toegevoegd? Via een state?
directionFsm.on('exit:arriving', () => enterView.$el.detach()); // hier weggehaald uit main  wat is enter en exit?

directionFsm.on('enter:leaving', () => exitView.render().$el.appendTo('main'));
directionFsm.on('exit:leaving', () => exitView.$el.detach());


// directionFsm.on('enter:testrobert', () => testrobertView.render().$el.appendTo('main'));// dit komt in een div binnen element 'main'
// directionFsm.on('exit:testrobert', () => testrobertView.$el.detach());