define([
    'marionette'
], function(Marionette) {

    return Marionette.CollectionView.extend({
        tagName: 'ul',
        className: "list-unstyled entities-list"
    });

});