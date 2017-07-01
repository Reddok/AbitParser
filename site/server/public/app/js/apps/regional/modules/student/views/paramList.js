define([
    "config/views/table",
    "apps/regional/modules/student/views/param",
    "tpl!apps/regional/modules/student/templates/paramList.tpl"
], function(TableView, RowView, TableTpl) {

    return TableView.extend({
        className: TableView.prototype.className + ' no-highlight',
        rowView: RowView,
        template: TableTpl
    });

});