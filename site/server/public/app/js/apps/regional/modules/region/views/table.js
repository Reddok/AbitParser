define(["config/views/table", "apps/regional/modules/region/views/item", "tpl!apps/regional/modules/region/templates/table.tpl"], function(TableView, RowView, TableTpl) {

    return TableView.extend({
        rowView: RowView,
        template: TableTpl
    });

});