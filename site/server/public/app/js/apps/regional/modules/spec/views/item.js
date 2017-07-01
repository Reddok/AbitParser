define(['marionette', 'tpl!apps/regional/modules/spec/templates/item.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'tr',
        className: function() {
            var enrolledSpec = this.model.get("enrolled");

            if(typeof enrolledSpec === "undefined") {
                var chance = this.model.get("chance");
                if(chance >= 70) return "success";
                if(chance < 70 && chance >= 40) return "warning";
                if(chance < 40) return "danger";
            } else if(enrolledSpec === this.model.get("statement").spec){
                return "enrolled";
            } else {
                return "refused";
            }
        },
        template: ItemTpl,

        triggers: {
            'click': 'student:show'
        }

    });

});