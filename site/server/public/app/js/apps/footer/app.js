define(['underscore', 'apps/footer/modules/footer/module'], function(_, Footer) {

    App.on("footer:get", _.bind(Footer.Controller.showFooter, Footer.Controller));

    return {
        modules:{
            Footer: Footer
        }

    }

});