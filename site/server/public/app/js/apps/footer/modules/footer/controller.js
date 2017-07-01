define(function() {

   return {
       showFooter(lastUpdated) {

           require(["apps/footer/modules/footer/views/footer"], function(FooterView) {

               App.regions.showChildView('footer', new FooterView({lastUpdated: lastUpdated}));

           });

       }
   }

});