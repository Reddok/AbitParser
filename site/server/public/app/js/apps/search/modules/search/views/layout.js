define(['marionette', 'animatedRegion', 'tpl!apps/search/modules/search/templates/layout.tpl'], function(Marionette, AnimatedRegion, LayoutTpl) {

    return Marionette.View.extend({

        template: LayoutTpl,
        regions: {
            'form': '#form-wrap',
            'students': {
                selector: '#students-wrap',
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
            }
        }

    });

});