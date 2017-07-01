define([
    "jquery"
], function($) {

    function getYears() {
        return $.ajax({url: "/archive"})
            .then(
                function(data) { return data},
                function(err) {throw err}
            );
    }


    App.channel.reply('years:entities', getYears);

});