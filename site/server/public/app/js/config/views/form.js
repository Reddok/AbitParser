define([
    'jquery',
    'underscore',
    'marionette',
    'syphon'
], function($, _, Marionette, syphon) {


        var Form = Marionette.View.extend({

            initialize: function(options) {
                this.title = options.title;
                this.entity = options.entity;
                this.dialog = options.dialog || {};
            },

            events: {
                'click button.js-submit': 'submitClicked'
            },

            ui: {
                form: "form"
            }

        });

        _.extend(Form.prototype, {
            submitClicked: function() {
                clearFormFields(this);
                this.triggerMethod('before:form:submit');
                var data = syphon.serialize(this);
                this.triggerMethod('form:submit', data);
                return false;
            },

            onFormDataInvalid: function(errors){
                console.log("form errors", errors);
                clearFormFields(this);
                _.each(errors, errorHandler.bind(null, this));
            }
        });

    return Form;


    function clearFormFields(view) {
        console.log("clear fields", view.getUI('form').find(".help-block.error"), arguments);
        view.getUI('form').find(".help-block.error").each(function() {
            $(this).remove();
        });
        view.getUI('form').find(".form-group.has-error").removeClass("has-error has-feedback");
    }

    function errorHandler(view, value, key) {
        var $controlGroup = view.getUI('form').find("#" + key + "-field"),
            $message = $("<span>", {class: 'help-block error', text: value});
        $controlGroup.parent().append($message).addClass("has-error has-feedback");
    }

});