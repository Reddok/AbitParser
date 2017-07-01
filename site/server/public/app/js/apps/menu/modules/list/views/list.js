define([
    'jquery',
    'marionette',
    'apps/menu/modules/list/views/item',
    'bootstrap'
], function($, Marionette, itemView) {

    return Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'nav navbar-nav',
        childView: itemView
    });

});