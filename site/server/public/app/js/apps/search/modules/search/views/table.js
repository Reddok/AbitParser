define([
    'config/views/table',
    'apps/search/modules/search/views/item',
    'apps/search/modules/search/views/empty',
    'tpl!apps/search/modules/search/templates/table.tpl'
], function(TableView, ItemView, EmptyView, TableTpl) {

    return TableView.extend({
        template: TableTpl,
        rowView: ItemView
    });

});