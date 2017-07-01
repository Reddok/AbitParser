define(["backbone", "marionette"], function(Backbone, Marionette) {

    var TbodyView = Marionette.CollectionView.extend({
        tagName: "tbody"
    });

    var RowView = Marionette.View.extend({
        tagName: 'tr',
        template: "<td></td>"
    });

    var EmptyView = Marionette.View.extend({
        tagName: "tr",
        className: "table-empty-view",
        template: function() {
            return '<td class="center">По даному запиту нічого не знайдено...</td>';
        },
        onAttach: function() {
            var target = this.$el.find("td"),
                length = this.$el.closest("table").find("th").length;
            target.attr("colspan", length);
        }
    });

   return Marionette.View.extend({
        initialize:function(options) {
            options || (options = {});
            var CollectionView = options.CollectionView || this.tbodyView || TbodyView,
                collection = options.collection || new Backbone.Collection(),
                Child = options.RowView || CollectionView.prototype.childView || this.rowView || RowView,
                Empty = options.EmptyView || CollectionView.prototype.emptyView || this.emptyView || EmptyView,
                collectionView = new CollectionView({childView: Child, emptyView: Empty, collection: collection});


            this.listenTo(collectionView, "all", function(eventName) {
                var args = Array.prototype.slice.call(arguments);
                args[0] = "table:" + args[0];
                this.trigger.apply(this, args);
            });

            this.listenTo(this, "render", function() {
                this.showChildView("body", collectionView)
            })
        },
        tagName: "table",
        className: "table custom-table",
        regions: {
            body: {
                el: 'tbody',
                replaceElement: true
            }
        }
    });


});