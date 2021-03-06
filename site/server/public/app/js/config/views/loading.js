define(['jquery', 'underscore', 'marionette', 'spin', 'jqSpin'], function($, _, Marionette) {

    return  Marionette.View.extend({
        template: '<div id="spinner"></div>',
        className: "spinner-wrap",
        initialize: function(options) {
            this.spinOptions = options.spinOptions || {};
        },

        onRender: function() {

            var defOpts = {
                lines: 10, // The number of lines to draw
                length: 13, // The length of each line
                width: 4, // The line thickness
                radius: 20, // The radius of the inner circle
                corners: 1 , // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1 , // 1: clockwise, -1: counterclockwise
                color: "#000" , // #rgb or #rrggbb
                speed: 2 , // Rounds per second
                trail : 60, // Afterglow percentage
                shadow: true, // Whether to render a shadow
                hwaccel : false, // Whether to use hardware acceleration
                className: "spinner" , // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: "50%" , // Top position relative to parent in px
                left: "50%" // Left position relative to parent in px
            };

            this.$el.spin(_.extend(defOpts, this.spinOptions));

        }
    });

});