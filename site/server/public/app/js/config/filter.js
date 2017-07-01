define([], function() {

   return function(criterion) {
        criterion = criterion.toLowerCase();
        return function(item) {
            console.log(criterion, item.get('name').toLowerCase(), item.get('name').toLowerCase().indexOf(criterion));
            return !!~item.get('name').toLowerCase().indexOf(criterion);
        }

   }

});