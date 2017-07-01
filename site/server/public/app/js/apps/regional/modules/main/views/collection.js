define([
    'config/views/listView',
    'apps/regional/modules/main/views/item',
    'apps/regional/modules/main/views/empty'
], function(ListView, ItemView, EmptyView) {

    return ListView.extend({
        tagName: 'ul',
        childView: ItemView,
        emptyView: EmptyView
    });

});