define(['marionette'], function(Marionette) {

   return Marionette.AppRouter.extend({

       appRoutes: {
           'regions(/)': "showMain",
           'regions/:id(/)': "showRegion",
           'univers/:id(/)': "showUniver",
           'specs/:id(/)': "showSpec",
           'students/:id(/)': "showStudent"
       }

   });

});