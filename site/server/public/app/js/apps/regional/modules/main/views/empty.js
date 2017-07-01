define(["marionette"], function(Marionette) {

    return Marionette.View.extend({
        tagName: "li",
        className: "col-empty",
        template: "<span>По даному запиту нічого не знайдено...</span>"
    });

});