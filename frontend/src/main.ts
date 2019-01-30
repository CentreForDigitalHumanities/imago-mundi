import { history } from 'backbone';
import { when, ready } from 'jquery';
import '@dhl-uu/jquery-promise';
import { baseUrl } from 'config.json';
import { i18nPromise } from './global/i18n';
import './global/internalLinks';
import './global/hbsHelpers';
//import './aspects/example'; //oorspronkelijk
import './aspects/imagomundi';

when(ready, i18nPromise).done(function () {
    let success = history.start({
        root: baseUrl,
        //root: '/',
        pushState: true,
    });
});

// ongeveer:
//als de i18n functie gedaan is, dan history.start uitvoeren. baseUrl als root meesturen ("/")

//hoe wordt als default de arrive view gerendered? antw: gebeurt in router, 

//When all of your Routers have been created, and all of the routes are set up properly, call Backbone.history.start() to begin monitoring hashchange events, and dispatching routes.
//To indicate that you'd like to use HTML5 pushState support in your application, use Backbone.history.start({pushState: true})
//If your application is not being served from the root url / of your domain, be sure to tell History where the root really is, as an option: Backbone.history.start({pushState: true, root: "/public/search/"})
//is main.ts de default die altijd gebruikt wordt idem als een index.html? Hoe rendered main.ts de index.hbs? antw: de index.hbs wordt naar index.html gecompiled in /dist folder