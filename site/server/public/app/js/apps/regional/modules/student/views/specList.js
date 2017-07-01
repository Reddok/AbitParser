define([
    "config/views/table",
    "apps/regional/modules/student/views/spec",
    "tpl!apps/regional/modules/student/templates/specList.tpl"
], function(TableView, RowView, TableTpl) {

    return TableView.extend({
        rowView: RowView,
        template: TableTpl
    });

});