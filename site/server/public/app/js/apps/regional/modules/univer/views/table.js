define([
    "config/views/table",
    "apps/regional/modules/univer/views/item",
    "tpl!apps/regional/modules/univer/templates/table.tpl"
], function(TableView, RowView, TableTpl) {

    return TableView.extend({
        rowView: RowView,
        template: TableTpl
    });

});