define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            avatar: "/public/app/images/default-user-image.png"
        },
        urlRoot: '/students',

       /* parse: function(res) {
            var statements = res.statements,
                sumPoints = statements.reduce(function(sum, current) {
                    return sum + current.rank;
                },0);
            statements.forEach(function(statement) {
                statement.likelyhood = Math.round((statement.rank / sumPoints) * 100);
            });

            return res;
        }*/

    });

});