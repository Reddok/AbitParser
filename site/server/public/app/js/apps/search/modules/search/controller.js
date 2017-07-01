define([], function() {


    return {
        show: function(options) {
            require([
                'jquery',
                'apps/search/modules/search/views/layout',
                'apps/search/modules/search/views/table',
                'apps/search/modules/search/views/form',
                'config/views/loading',
                'config/views/paginated',
                'config/errorHandler',
                'entities/students/entity',
                'entities/years/entity'
            ], function($, LayoutView, TableView, FormView, LoadingView, PaginatedView, errorHandler) {
                console.log("options to page", options);
                var currentModule = "search",
                    studentsRequest = App.channel.request('student:entities:paged', {parameters: options}),
                    yearsRequest = App.channel.request('years:entities');

                App.currentModule = currentModule;
                App.regions.showChildView('content', new LoadingView());

                options || (options = {});
                $.when(studentsRequest, yearsRequest).then(

                    function (students, years) {
                        console.log("kotl, give me students!", students);
                        if(App.currentModule === currentModule) {
                            /*Встановлюю змінні і ініціалізую вьюшки лаяута і форми*/
                            var layout = new LayoutView(),
                                formView = new FormView({years: years}),
                                paginatedView;


                            /*Якщо сторінка рендериться з активним значенням пошуку, встановлюю це значення в поле форми*/

                            if (options.pattern) {
                                formView.once("render", function () {
                                    formView.triggerMethod("set:search:state", options.pattern);
                                })
                            }

                            /*Ініціалізація пагінованої вьюшки*/
                            paginatedView = new PaginatedView({
                                collection: students,
                                mainView: TableView,
                                propagatedEvents: ['table:childview:student:show'],
                                paginatedUrlBase: "search:pattern"
                            });

                            /*При показі лаяута показати внутрішні вьюшки*/
                            layout.listenTo(layout, 'render', function() {
                                layout.showChildView('form', formView);
                                layout.showChildView('students', paginatedView);
                            });

                            /*При зміні сторінки змінити параметри коллекції для її перезавантаження а також змінити урл*/
                            paginatedView.listenTo(paginatedView, 'page:change', function (page) {
                                students.parameters.set('page', page);
                                App.trigger('search:page:change', _.clone(students.parameters.attributes));
                            });


                            paginatedView.listenTo(students, "page:change:before", function() {
                                layout.detachChildView("students");
                                layout.showChildView('students', new LoadingView({spinOptions: {
                                    lines: 7,
                                    length: 15,
                                    width: 2,
                                    radius: 9
                                }}));
                            });

                            paginatedView.listenTo(students, 'page:change:after', function () {
                                layout.showChildView('students', paginatedView);
                            });


                            students.on("load:error", function(err) {
                                errorHandler(err);
                            });

                            /*При виборі студента показати його вьюшку*/
                            paginatedView.listenTo(paginatedView, 'table:childview:student:show', function(childView) {
                                console.log("it going to show student view2");
                                App.trigger('student:show', childView.model.get('_id'));
                            });


                            /*При сабміті форми провірити чи дані валідні. Якщо так, то прокинути далі, якщо ні - відобразити помилку*/
                            formView.listenTo(formView, 'form:submit', function (data) {
                                var error = validate(data);
                                if(error) return formView.triggerMethod('form:data:invalid', error);
                                formView.trigger('search:students', data);
                            });


                            /*Знайти всіх студентів по заданому патерну і обновити урл*/
                            formView.listenTo(formView, 'search:students', function (data) {
                                students.parameters.set({pattern: data.pattern, page: 1, year: data.year});
                                App.trigger('search:page:change', _.clone(students.parameters.attributes));
                            });

                            /*Відобразити лаяут*/
                            App.regions.showChildView('content', layout);
                        }
                    },

                    function(err) {
                        return err;
                    }

                ).fail(function(err) {
                        console.log('Сталась помилка при зчитуванні данних!');
                        errorHandler(err);
                });

            })

        }
    };

    function validate(data) {
        var errors = {};
        if(!data.pattern) errors.pattern = 'Не вказані дані!';
        else if(data.pattern.length < 3) errors.pattern = "Довжина символів має складати хоча б 3 букви!";
        if(Object.keys(errors).length) return errors;
    }
});