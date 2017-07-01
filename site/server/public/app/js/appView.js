define(['marionette', 'animatedRegion', 'tpl!app.tpl'], function(Marionette, AnimatedRegion, AppTpl) {

    return Marionette.View.extend({
        el: '#page',
        template: AppTpl,
        regions: {
            menu: "#menu-region",
            content: {
                selector: "#content-region",
                regionClass: AnimatedRegion,
                animation: {
                    showAnimation: [
                        {
                            properties: "transition.fadeIn",
                            options: {stagger: 300, duration: 500}
                        }
                    ],
                    hideAnimation: [
                        {
                            properties: "transition.fadeOut",
                            options: {stagger: 300, duration: 1000}
                        }
                    ]
                }
            },
            footer: "#footer-region"
        }
    })

});