'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../../vendor/js/jquery',
        underscore: '../../vendor/js/underscore',
        backbone: '../../vendor/js/backbone',
        bootstrap: '../../vendor/js/bootstrap',
        "backbone.radio": '../../vendor/js/backbone.radio',
        paginator: '../../vendor/js/backbone.paginator',
        marionette: '../../vendor/js/backbone.marionette.min',
        equalHeight: '../../vendor/js/equalHeight.min',
        select: '../../vendor/js/backbone.select.min',
        syphon: '../../vendor/js/syphon',
        text: '../../vendor/js/text',
        velocity: "../../vendor/js/velocity",
        "velocity.ui": "../../vendor/js/velocity.ui",
        "spin": "../../vendor/js/spin",
        "jqSpin": "../../vendor/js/jqSpin",
        tpl: '../../vendor/js/underscore.tpl',
        animatedRegion: "../../vendor/js/marionette.animatedRegion"
    }
});

require(['./app'], function (APP) {
    (window.App = new APP()).start(serverOptions);
});