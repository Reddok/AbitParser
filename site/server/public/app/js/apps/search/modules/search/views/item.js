define(['underscore', 'marionette', 'tpl!apps/search/modules/search/templates/item.tpl'], function(_, Marionette, ItemTpl) {

    return Marionette.View.extend({
        tagName: 'tr',
        template: ItemTpl,

        triggers: {
            'click': 'student:show'
        },

        serializeData: function() {
            var currentPage = this.model.collection.state.currentPage,
                pageSize = this.model.collection.state.pageSize,
                place = this.model.collection.indexOf(this.model);

            return _.extend({}, Marionette.View.prototype.serializeData.apply(this, arguments), {place: (currentPage - 1) * pageSize + (place + 1)});
        }

    });

});