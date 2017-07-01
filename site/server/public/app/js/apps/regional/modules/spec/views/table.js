define([
    "config/views/table",
    "apps/regional/modules/spec/views/item",
    "tpl!apps/regional/modules/spec/templates/table.tpl"
], function(TableView, RowView, TableTpl) {

    return TableView.extend({
        rowView: RowView,
        template: TableTpl
    });

});