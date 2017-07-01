define([
    'entities/students/models/index',
    'entities/students/collections/index',
    'entities/students/collections/paged',
    'config/entity',
    'config/strategies'
], function(StudentsModel, StudentsCollection, PagedCollection, API, strategies) {

    var student = new API(strategies.model, StudentsModel),
        students = new API(strategies.collection, StudentsCollection),
        paged = new API(strategies.paged, PagedCollection);

    App.channel.reply('student:entity', student.get, student);

    App.channel.reply('student:entities', function(options) {
        if(options && options.data) {
            var lastChar = options.data[options.data.length - 1];
            if(lastChar === "="|| lastChar === "-") return students.init();
        }
        return students.get(options);
    });

    App.channel.reply('student:entities:paged', function(options) {
        console.log("options before loading", options);
        if(options && options.parameters && options.parameters.pattern) return paged.get(options);
        else return paged.init();
    });

});