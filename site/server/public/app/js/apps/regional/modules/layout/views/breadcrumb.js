define(["marionette", "tpl!apps/regional/modules/layout/templates/breadcrumb.tpl"], function(Marionette, BreadCrumbTpl) {

    return Marionette.View.extend({
        tagName: "ol",
        className: "breadcrumb",
        template: BreadCrumbTpl,

        events: {
            "click li a": "changeLocation"
        },

        changeLocation: function(evt) {
            var $target = $(evt.target).closest("a");
            this.trigger("location:change", $target.data("trigger"), $target.data("id"));
            return false;
        }
    });


});