define(['underscore', 'config/views/form', 'tpl!apps/search/modules/search/templates/form.tpl'], function(_, Form, FormTpl) {

    return Form.extend({

        initialize: function(options) {
            this.years = options.years;
        },

        template: FormTpl,

        ui: _.defaults({
            searchField: '#pattern-field'
        }, Form.prototype.ui),

        serializeData: function() {
            return {years: this.years};
        },

        onSetSearchState: function(pattern) {
            this.getUI('searchField').val(pattern);
        }

    });

});