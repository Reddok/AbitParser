/*
 backbone.paginator
 http://github.com/backbone-paginator/backbone.paginator

 Copyright (c) 2016 Jimmy Yuen Ho Wong and contributors

 @module
 @license MIT
 */
!function(a){
// CommonJS
    if("object"==typeof exports&&"function"==typeof require)module.exports=a(require("underscore"),require("backbone"));else if("function"==typeof define&&define.amd)define(["underscore","backbone"],a);else if("undefined"!=typeof _&&"undefined"!=typeof Backbone){var b=Backbone.PageableCollection,c=a(_,Backbone);/**
     __BROWSER ONLY__

     If you already have an object named `PageableCollection` attached to the
     `Backbone` module, you can use this to return a local reference to this
     PageableCollection class and reset the name PageableCollection to its
     previous definition.

     // The left hand side gives you a reference to this
     // PageableCollection implementation, the right hand side
     // resets PageableCollection to your other PageableCollection.
     var PageableCollection = PageableCollection.noConflict();

     @static
     @return {PageableCollection}
     */
    Backbone.PageableCollection.noConflict=function(){return Backbone.PageableCollection=b,c}}}(function(a,b){"use strict";function c(b,c){if(!a.isNumber(b)||a.isNaN(b)||!a.isFinite(b)||~~b!==b)throw new TypeError("`"+c+"` must be a finite integer");return b}function d(a){for(var b,c,d,e,f={},g=decodeURIComponent,h=a.split("&"),i=0,j=h.length;i<j;i++){var k=h[i];b=k.split("="),c=b[0],d=b[1],null==d&&(d=!0),c=g(c),d=g(d),e=f[c],o(e)?e.push(d):e?f[c]=[e,d]:f[c]=d}return f}
// hack to make sure the whatever event handlers for this event is run
// before func is, and the event handlers that func will trigger.
    function e(a,b,c){var d=a._events[b];if(d&&d.length){var e=d[d.length-1],f=e.callback;e.callback=function(){try{f.apply(this,arguments),c()}catch(a){throw a}finally{e.callback=f}}}else c()}var f=a.extend,g=a.omit,h=a.clone,i=a.each,j=a.pick,k=a.contains,l=a.isEmpty,m=a.pairs,n=a.invert,o=a.isArray,p=a.isFunction,q=a.isObject,r=a.keys,s=a.isUndefined,t=Math.ceil,u=Math.floor,v=Math.max,w=b.Collection.prototype,x=/[\s'"]/g,y=/[<>\s'"]/g,z=b.PageableCollection=b.Collection.extend({/**
     The container object to store all pagination states.

     You can override the default state by extending this class or specifying
     them in an `options` hash to the constructor.

     @property {number} firstPage = 1 - The first page index. Set to 0 if
     your server API uses 0-based indices. You should only override this value
     during extension, initialization or reset by the server after
     fetching. This value should be read only at other times.

     @property {number} lastPage = null - The last page index. This value
     is __read only__ and it's calculated based on whether `firstPage` is 0 or
     1, during bootstrapping, fetching and resetting. Please don't change this
     value under any circumstances.

     @property {number} currentPage = null - The current page index. You
     should only override this value during extension, initialization or reset
     by the server after fetching. This value should be read only at other
     times. Can be a 0-based or 1-based index, depending on whether
     `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
     on initialization.

     @property {number} pageSize = 25 - How many records to show per
     page. This value is __read only__ after initialization, if you want to
     change the page size after initialization, you must call
     PageableCollection#setPageSize.

     @property {number} totalPages = null - How many pages there are. This
     value is __read only__ and it is calculated from `totalRecords`.

     @property {number} totalRecords = null - How many records there
     are. This value is __required__ under server mode. This value is optional
     for client mode as the number will be the same as the number of models
     during bootstrapping and during fetching, either supplied by the server
     in the metadata, or calculated from the size of the response.

     @property {string} sortKey = null - The model attribute to use for
     sorting.

     @property {number} order = -1 - The order to use for sorting. Specify
     -1 for ascending order or 1 for descending order. If 0, no client side
     sorting will be done and the order query parameter will not be sent to
     the server during a fetch.
     */
    state:{firstPage:1,lastPage:null,currentPage:null,pageSize:25,totalPages:null,totalRecords:null,sortKey:null,order:-1},/**
     @property {string} mode = "server" The mode of operations for this
     collection. `"server"` paginates on the server-side, `"client"` paginates
     on the client-side and `"infinite"` paginates on the server-side for APIs
     that do not support `totalRecords`.
     */
    mode:"server",/**
     A translation map to convert PageableCollection state attributes
     to the query parameters accepted by your server API.

     You can override the default state by extending this class or specifying
     them in `options.queryParams` object hash to the constructor.

     @property {string} currentPage = "page"
     @property {string} pageSize = "per_page"
     @property {string} totalPages = "total_pages"
     @property {string} totalRecords = "total_entries"
     @property {string} sortKey = "sort_by"
     @property {string} order = "order"
     @property {string} directions = {"-1": "asc", "1": "desc"} - A map for
     translating a PageableCollection#state.order constant to the ones your
     server API accepts.
     */
    queryParams:{currentPage:"page",pageSize:"per_page",totalPages:"total_pages",totalRecords:"total_entries",sortKey:"sort_by",order:"order",directions:{"-1":"asc",1:"desc"}},/**
     Given a list of models or model attributues, bootstraps the full
     collection in client mode or infinite mode, or just the page you want in
     server mode.

     If you want to initialize a collection to a different state than the
     default, you can specify them in `options.state`. Any state parameters
     supplied will be merged with the default. If you want to change the
     default mapping from PageableCollection#state keys to your server API's
     query parameter names, you can specifiy an object hash in
     `option.queryParams`. Likewise, any mapping provided will be merged with
     the default. Lastly, all Backbone.Collection constructor options are also
     accepted.

     See:

     - PageableCollection#state
     - PageableCollection#queryParams
     - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

     @constructor

     @property {Backbone.Collection} fullCollection - __CLIENT MODE ONLY__
     This collection is the internal storage for the bootstrapped or fetched
     models. You can use this if you want to operate on all the pages.

     @param {Array.<Object>} models

     @param {Object} options

     @param {function(*, *): number} options.comparator - If specified, this
     comparator is set to the current page under server mode, or the
     PageableCollection#fullCollection otherwise.

     @param {boolean} options.full 0 If `false` and either a
     `options.comparator` or `sortKey` is defined, the comparator is attached
     to the current page. Default is `true` under client or infinite mode and
     the comparator will be attached to the PageableCollection#fullCollection.

     @param {Object} options.state - The state attributes overriding the defaults.

     @param {string} options.state.sortKey - The model attribute to use for
     sorting. If specified instead of `options.comparator`, a comparator will
     be automatically created using this value, and optionally a sorting order
     specified in `options.state.order`. The comparator is then attached to
     the new collection instance.

     @param {number} options.state.order - The order to use for sorting. Specify
     -1 for ascending order and 1 for descending order.

     @param {Object} options.queryParam
     */
    constructor:function(a,b){w.constructor.apply(this,arguments),b=b||{};var c=this.mode=b.mode||this.mode||A.mode,d=f({},A.queryParams,this.queryParams,b.queryParams||{});d.directions=f({},A.queryParams.directions,this.queryParams.directions,d.directions),this.queryParams=d;var e=this.state=f({},A.state,this.state,b.state);e.currentPage=null==e.currentPage?e.firstPage:e.currentPage,o(a)||(a=a?[a]:[]),a=a.slice(),"server"==c||null!=e.totalRecords||l(a)||(e.totalRecords=a.length),this.switchMode(c,f({fetch:!1,resetState:!1,models:a},b));var g=b.comparator;if(e.sortKey&&!g&&this.setSorting(e.sortKey,e.order,b),"server"!=c){var i=this.fullCollection;g&&b.full&&(this.comparator=null,i.comparator=g),b.full&&i.sort(),
// make sure the models in the current page and full collection have the
// same references
    l(a)||(this.reset(a,f({silent:!0},b)),this.getPage(e.currentPage),a.splice.apply(a,[0,a.length].concat(this.models)))}this._initState=h(this.state)},/**
     Makes a Backbone.Collection that contains all the pages.

     @private
     @param {Array.<Object|Backbone.Model>} models
     @param {Object} options Options for Backbone.Collection constructor.
     @return {Backbone.Collection}
     */
    _makeFullCollection:function(a,c){var d,e,f,g=["url","model","sync","comparator"],h=this.constructor.prototype,i={};for(d=0,e=g.length;d<e;d++)f=g[d],s(h[f])||(i[f]=h[f]);var j=new(b.Collection.extend(i))(a,c);for(d=0,e=g.length;d<e;d++)f=g[d],this[f]!==h[f]&&(j[f]=this[f]);return j},/**
     Factory method that returns a Backbone event handler that responses to
     the `add`, `remove`, `reset`, and the `sort` events. The returned event
     handler will synchronize the current page collection and the full
     collection's models.

     @private

     @fires PageableCollection#pageable:state:change when handling an
     `add`, `remove`, or `reset` event

     @param {PageableCollection} pageCol
     @param {Backbone.Collection} fullCol

     @return {function(string, Backbone.Model, Backbone.Collection, Object)}
     Collection event handler
     */
    _makeCollectionEventHandler:function(a,b){return function(c,d,g,j){var k=a._handlers;i(r(k),function(c){var d=k[c];a.off(c,d),b.off(c,d)});var l=h(a.state),m=l.firstPage,n=0===m?l.currentPage:l.currentPage-1,o=l.pageSize,p=n*o,q=p+o;if("add"==c){var u,v,w,x,j=j||{};if(g==b)v=b.indexOf(d),v>=p&&v<q&&(x=a,u=w=v-p);else{u=a.indexOf(d),v=p+u,x=b;var w=s(j.at)?v:j.at+p}if(j.onRemove||(++l.totalRecords,delete j.onRemove),a.state=a._checkState(l),x){x.add(d,f({},j,{at:w}));var y=u>=o?d:!s(j.at)&&w<q&&a.length>o?a.at(o):null;y&&e(g,c,function(){a.remove(y,{onAdd:!0})})}j.silent||a.trigger("pageable:state:change",a.state)}
// remove the model from the other collection as well
        if("remove"==c){if(j.onAdd)delete j.onAdd;else{
// decrement totalRecords and update totalPages and lastPage
            if(--l.totalRecords){var z=l.totalPages=t(l.totalRecords/o);l.lastPage=0===m?z-1:z||m,l.currentPage>z&&(l.currentPage=l.lastPage)}else l.totalRecords=null,l.totalPages=null;a.state=a._checkState(l);var A,B=j.index;g==a?((A=b.at(q))?e(a,c,function(){a.push(A,{onRemove:!0})}):!a.length&&l.totalRecords&&a.reset(b.models.slice(p-o,q-o),f({},j,{parse:!1})),b.remove(d)):B>=p&&B<q&&((A=b.at(q-1))&&e(a,c,function(){a.push(A,{onRemove:!0})}),a.remove(d),!a.length&&l.totalRecords&&a.reset(b.models.slice(p-o,q-o),f({},j,{parse:!1})))}j.silent||a.trigger("pageable:state:change",a.state)}if("reset"==c){
// Reset that's not a result of getPage
            if(j=g,g=d,g==a&&null==j.from&&null==j.to){var C=b.models.slice(0,p),D=b.models.slice(p+a.models.length);b.reset(C.concat(a.models).concat(D),j)}else g==b&&((l.totalRecords=b.models.length)||(l.totalRecords=null,l.totalPages=null),"client"==a.mode&&(m=l.lastPage=l.currentPage=l.firstPage,n=0===m?l.currentPage:l.currentPage-1,p=n*o,q=p+o),a.state=a._checkState(l),a.reset(b.models.slice(p,q),f({},j,{parse:!1})));j.silent||a.trigger("pageable:state:change",a.state)}"sort"==c&&(j=g,g=d,g===b&&a.reset(b.models.slice(p,q),f({},j,{parse:!1}))),i(r(k),function(c){var d=k[c];i([a,b],function(a){a.on(c,d);var b=a._events[c]||[];b.unshift(b.pop())})})}},/**
     Sanity check this collection's pagination states. Only perform checks
     when all the required pagination state values are defined and not null.
     If `totalPages` is undefined or null, it is set to `totalRecords` /
     `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
     when no error occurs.

     @private

     @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
     `firstPage` is not a finite integer.

     @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
     of bounds.

     @return {Object} Returns the `state` object if no error was found.
     */
    _checkState:function(a){var b=this.mode,d=this.links,e=a.totalRecords,f=a.pageSize,g=a.currentPage,h=a.firstPage,i=a.totalPages;if(null!=e&&null!=f&&null!=g&&null!=h&&("infinite"!=b||d)){if(e=c(e,"totalRecords"),f=c(f,"pageSize"),g=c(g,"currentPage"),h=c(h,"firstPage"),f<1)throw new RangeError("`pageSize` must be >= 1");if(i=a.totalPages=t(e/f),h<0||h>1)throw new RangeError("`firstPage must be 0 or 1`");if(a.lastPage=0===h?v(0,i-1):i||h,"infinite"==b){if(!d[g])throw new RangeError("No link found for page "+g)}else if(g<h||i>0&&(h?g>i:g>=i))throw new RangeError("`currentPage` must be firstPage <= currentPage "+(h?"<":"<=")+" totalPages if "+h+"-based. Got "+g+".")}return a},/**
     Change the page size of this collection.

     Under most if not all circumstances, you should call this method to
     change the page size of a pageable collection because it will keep the
     pagination state sane. By default, the method will recalculate the
     current page number to one that will retain the current page's models
     when increasing the page size. When decreasing the page size, this method
     will retain the last models to the current page that will fit into the
     smaller page size.

     If `options.first` is true, changing the page size will also reset the
     current page back to the first page instead of trying to be smart.

     For server mode operations, changing the page size will trigger a
     PageableCollection#fetch and subsequently a `reset` event.

     For client mode operations, changing the page size will `reset` the
     current page by recalculating the current page boundary on the client
     side.

     If `options.fetch` is true, a fetch can be forced if the collection is in
     client mode.

     @param {number} pageSize - The new page size to set to PageableCollection#state.
     @param {Object} options - {@link PageableCollection#fetch} options.
     @param {boolean} options.first = false 0 Reset the current page number to
     the first page if `true`.
     @param {boolean} options.fetch - If `true`, force a fetch in client mode.

     @throws {TypeError} If `pageSize` is not a finite integer.
     @throws {RangeError} If `pageSize` is less than 1.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    setPageSize:function(a,b){a=c(a,"pageSize"),b=b||{first:!1};var d=this.state,e=t(d.totalRecords/a),h=e?v(d.firstPage,u(e*d.currentPage/d.totalPages)):d.firstPage;return d=this.state=this._checkState(f({},d,{pageSize:a,currentPage:b.first?d.firstPage:h,totalPages:e})),this.getPage(d.currentPage,g(b,["first"]))},/**
     Switching between client, server and infinite mode.

     If switching from client to server mode, the #fullCollection is emptied
     first and then deleted and a fetch is immediately issued for the current
     page from the server. Pass `false` to `options.fetch` to skip fetching.

     If switching to infinite mode, and if `options.models` is given for an
     array of models,PageableCollection#links will be populated with a URL per
     page, using the default URL for this collection.

     If switching from server to client mode, all of the pages are immediately
     refetched. If you have too many pages, you can pass `false` to
     `options.fetch` to skip fetching.

     If switching to any mode from infinite mode, thePageableCollection#links
     will be deleted.

     @fires PageableCollection#pageable:state:change

     @param {"server"|"client"|"infinite"} mode - The mode to switch to.

     @param {Object} options

     @param {boolean} options.fetch = true - If `false`, no fetching is done.

     @param {boolean} options.resetState = true - If 'false', the state is not
     reset, but checked for sanity instead.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this if `options.fetch` is `false`.
     */
    switchMode:function(b,c){if(!k(["server","client","infinite"],b))throw new TypeError('`mode` must be one of "server", "client" or "infinite"');c=c||{fetch:!0,resetState:!0};var d=this.state=c.resetState?h(this._initState):this._checkState(f({},this.state));this.mode=b;var e,j=this,l=this.fullCollection,m=this._handlers=this._handlers||{};if("server"==b||l)"server"==b&&l&&(i(r(m),function(a){e=m[a],j.off(a,e),l.off(a,e)}),delete this._handlers,this._fullComparator=l.comparator,delete this.fullCollection);else{l=this._makeFullCollection(c.models||[],c),l.pageableCollection=this,this.fullCollection=l;var n=this._makeCollectionEventHandler(this,l);i(["add","remove","reset","sort"],function(b){m[b]=e=a.bind(n,{},b),j.on(b,e),l.on(b,e)}),l.comparator=this._fullComparator}if("infinite"==b)for(var o=this.links={},p=d.firstPage,q=t(d.totalRecords/d.pageSize),s=0===p?v(0,q-1):q||p,u=d.firstPage;u<=s;u++)o[u]=this.url;else this.links&&delete this.links;return c.silent||this.trigger("pageable:state:change",d),c.fetch?this.fetch(g(c,"fetch","resetState")):this},/**
     @return {boolean} `true` if this collection can page backward, `false`
     otherwise.
     */
    hasPreviousPage:function(){var a=this.state,b=a.currentPage;return"infinite"!=this.mode?b>a.firstPage:!!this.links[b-1]},/**
     @return {boolean} `true` if this collection can page forward, `false`
     otherwise.
     */
    hasNextPage:function(){var a=this.state,b=this.state.currentPage;return"infinite"!=this.mode?b<a.lastPage:!!this.links[b+1]},/**
     Fetch the first page in server mode, or reset the current page of this
     collection to the first page in client or infinite mode.

     @param {Object} options {@linkPageableCollection#getPage} options.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getFirstPage:function(a){return this.getPage("first",a)},/**
     Fetch the previous page in server mode, or reset the current page of this
     collection to the previous page in client or infinite mode.

     @param {Object} options {@linkPageableCollection#getPage} options.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getPreviousPage:function(a){return this.getPage("prev",a)},/**
     Fetch the next page in server mode, or reset the current page of this
     collection to the next page in client mode.

     @param {Object} options {@linkPageableCollection#getPage} options.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getNextPage:function(a){return this.getPage("next",a)},/**
     Fetch the last page in server mode, or reset the current page of this
     collection to the last page in client mode.

     @param {Object} options {@linkPageableCollection#getPage} options.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getLastPage:function(a){return this.getPage("last",a)},/**
     Given a page index, set PageableCollection#state.currentPage to that
     index. If this collection is in server mode, fetch the page using the
     updated state, otherwise, reset the current page of this collection to
     the page specified by `index` in client mode. If `options.fetch` is true,
     a fetch can be forced in client mode before resetting the current
     page. Under infinite mode, if the index is less than the current page, a
     reset is done as in client mode. If the index is greater than the current
     page number, a fetch is made with the results **appended**
     toPageableCollection#fullCollection.  The current page will then be reset
     after fetching.

     @fires PageableCollection#pageable:state:change

     @param {number|string} index - The page index to go to, or the page name to
     look up fromPageableCollection#links in infinite mode.
     @param {Object} options - {@linkPageableCollection#fetch} options or
     [reset](http://backbonejs.org/#Collection-reset) options for client mode
     when `options.fetch` is `false`.
     @param {boolean} options.fetch = false - If true, force a
     {@linkPageableCollection#fetch} in client mode.

     @throws {TypeError} If `index` is not a finite integer under server or
     client mode, or does not yield a URL fromPageableCollection#links under
     infinite mode.

     @throws {RangeError} If `index` is out of bounds.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getPage:function(a,b){var d=this.mode,e=this.fullCollection;b=b||{fetch:!1};var h=this.state,i=h.firstPage,j=h.currentPage,k=h.lastPage,m=h.pageSize,n=a;switch(a){case"first":n=i;break;case"prev":n=j-1;break;case"next":n=j+1;break;case"last":n=k;break;default:n=c(a,"index")}this.state=this._checkState(f({},h,{currentPage:n})),b.silent||this.trigger("pageable:state:change",this.state),b.from=j,b.to=n;var o=(0===i?n:n-1)*m,p=e&&e.length?e.models.slice(o,o+m):[];return"client"!=d&&("infinite"!=d||l(p))||b.fetch?("infinite"==d&&(b.url=this.links[n]),this.fetch(g(b,"fetch"))):(this.reset(p,g(b,"fetch")),this)},/**
     Fetch the page for the provided item offset in server mode, or reset the
     current page of this collection to the page for the provided item offset
     in client mode.

     @param {Object} options {@linkPageableCollection#getPage} options.

     @chainable
     @return {XMLHttpRequest|PageableCollection} The XMLHttpRequest
     from fetch or this.
     */
    getPageByOffset:function(a,b){if(a<0)throw new RangeError("`offset must be > 0`");a=c(a);var d=u(a/this.state.pageSize);return 0!==this.state.firstPage&&d++,d>this.state.lastPage&&(d=this.state.lastPage),this.getPage(d,b)},/**
     Overidden to make `getPage` compatible with Zepto.

     @param {string} method
     @param {Backbone.Model|Backbone.Collection} model
     @param {Object} options

     @return {XMLHttpRequest}
     */
    sync:function(a,c,d){var e=this;if("infinite"==e.mode){var g=d.success,h=e.state.currentPage;d.success=function(a,b,c){var i=e.links,j=e.parseLinks(a,f({xhr:c},d));j.first&&(i[e.state.firstPage]=j.first),j.prev&&(i[h-1]=j.prev),j.next&&(i[h+1]=j.next),g&&g(a,b,c)}}return(w.sync||b.sync).call(e,a,c,d)},/**
     Parse pagination links from the server response. Only valid under
     infinite mode.

     Given a response body and a XMLHttpRequest object, extract pagination
     links from them for infinite paging.

     This default implementation parses the RFC 5988 `Link` header and extract
     3 links from it - `first`, `prev`, `next`. Any subclasses overriding this
     method __must__ return an object hash having only the keys
     above. However, simply returning a `next` link or an empty hash if there
     are no more links should be enough for most implementations.

     @param {*} resp The deserialized response body.
     @param {Object} options
     @param {XMLHttpRequest} options.xhr - The XMLHttpRequest object for this
     response.
     @return {Object}
     */
    parseLinks:function(a,b){var c={},d=b.xhr.getResponseHeader("Link");if(d){var e=["first","prev","next"];i(d.split(","),function(a){var b=a.split(";"),d=b[0].replace(y,""),f=b.slice(1);i(f,function(a){var b=a.split("="),f=b[0].replace(x,""),g=b[1].replace(x,"");"rel"==f&&k(e,g)&&(c[g]=d)})})}return c},/**
     Parse server response data.

     This default implementation assumes the response data is in one of two
     structures:

     [
     {}, // Your new pagination state
     [{}, ...] // An array of JSON objects
     ]

     Or,

     [{}] // An array of JSON objects

     The first structure is the preferred form because the pagination states
     may have been updated on the server side, sending them down again allows
     this collection to update its states. If the response has a pagination
     state object, it is checked for errors.

     The second structure is the
     [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
     default.

     **Note:** this method has been further simplified since 1.1.7. While
     existingPageableCollection#parse implementations will continue to work,
     new code is encouraged to overridePageableCollection#parseState
     andPageableCollection#parseRecords instead.

     @param {Object} resp The deserialized response data from the server.
     @param {Object} the options for the ajax request

     @return {Array.<Object>} An array of model objects
     */
    parse:function(a,b){var c=this.parseState(a,h(this.queryParams),h(this.state),b);return c&&(this.state=this._checkState(f({},this.state,c))),this.parseRecords(a,b)},/**
     Parse server response for server pagination state updates. Not applicable
     under infinite mode.

     This default implementation first checks whether the response has any
     state object as documented inPageableCollection#parse. If it exists, a
     state object is returned by mapping the server state keys to this
     pageable collection instance's query parameter keys using `queryParams`.

     It is __NOT__ neccessary to return a full state object complete with all
     the mappings defined inPageableCollection#queryParams. Any state object
     resulted is merged with a copy of the current pageable collection state
     and checked for sanity before actually updating. Most of the time, simply
     providing a new `totalRecords` value is enough to trigger a full
     pagination state recalculation.

     parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

     If you want to use header fields use:

     parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

     This method __MUST__ return a new state object instead of directly
     modifying the PageableCollection#state object. The behavior of directly
     modifying PageableCollection#state is undefined.

     @param {Object} resp - The deserialized response data from the server.
     @param {Object} queryParams - A copy of PageableCollection#queryParams.
     @param {Object} state - A copy of PageableCollection#state.
     @param {Object} options - The options passed through from
     `parse`. (backbone >= 0.9.10 only)

     @return {Object} A new (partial) state object.
     */
    parseState:function(b,c,d,e){if(b&&2===b.length&&q(b[0])&&o(b[1])){var f=h(d),j=b[0];return i(m(g(c,"directions")),function(b){var c=b[0],d=b[1],e=j[d];s(e)||a.isNull(e)||(f[c]=j[d])}),j.order&&(f.order=1*n(c.directions)[j.order]),f}},/**
     Parse server response for an array of model objects.

     This default implementation first checks whether the response has any
     state object as documented inPageableCollection#parse. If it exists, the
     array of model objects is assumed to be the second element, otherwise the
     entire response is returned directly.

     @param {Object} resp - The deserialized response data from the server.
     @param {Object} options - The options passed through from the
     `parse`. (backbone >= 0.9.10 only)

     @return {Array.<Object>} An array of model objects
     */
    parseRecords:function(a,b){return a&&2===a.length&&q(a[0])&&o(a[1])?a[1]:a},/**
     Fetch a page from the server in server mode, or all the pages in client
     mode. Under infinite mode, the current page is refetched by default and
     then reset.

     The query string is constructed by translating the current pagination
     state to your server API query parameter
     usingPageableCollection#queryParams. The current page will reset after
     fetch.

     @param {Object} options - Accepts all
     [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
     options.

     @return {XMLHttpRequest}
     */
    fetch:function(b){b=b||{};var c=this._checkState(this.state),e=this.mode;"infinite"!=e||b.url||(b.url=this.links[c.currentPage]);var h=b.data||{},i=b.url||this.url||"";p(i)&&(i=i.call(this));var k=i.indexOf("?");k!=-1&&(f(h,d(i.slice(k+1))),i=i.slice(0,k)),b.url=i,b.data=h;
// map params except directions
        var l="client"==this.mode?j(this.queryParams,"sortKey","order"):g(j(this.queryParams,r(A.queryParams)),"directions","totalPages","totalRecords"),n=a.clone(this);a.each(l,function(b,d){b=p(b)?b.call(n):b,null!=c[d]&&null!=b&&a.isUndefined(h[b])&&(h[b]=c[d])},this);
// fix up sorting parameters
        var q;if(c.sortKey&&c.order){var t=p(l.order)?l.order.call(n):l.order;if(o(c.order))for(h[t]=[],q=0;q<c.order.length;q+=1)h[t].push(this.queryParams.directions[c.order[q]]);else h[t]=this.queryParams.directions[c.order+""]}else c.sortKey||delete h[l.order];
// map extra query parameters
        var u,v,x=m(g(this.queryParams,r(A.queryParams)));for(q=0;q<x.length;q++)u=x[q],v=u[1],v=p(v)?v.call(n):v,null!=v&&(h[u[0]]=v);if("server"!=e){var y=this,z=this.fullCollection,B=b.success;
// silent the first reset from backbone
            return b.success=function(a,c,d){
// make sure the caller's intent is obeyed
                d=d||{},s(b.silent)?delete d.silent:d.silent=b.silent;var g=a.models;"client"==e?z.reset(g,d):(z.add(g,f({at:z.length},f(d,{parse:!1}))),y.trigger("reset",y,d)),B&&B(a,c,d)},w.fetch.call(this,f({},b,{silent:!0}))}return w.fetch.call(this,b)},/**
     Convenient method for making a `comparator` sorted by a model attribute
     identified by `sortKey` and ordered by `order`.

     Like a Backbone.Collection, a PageableCollection will maintain the
     __current page__ in sorted order on the client side if a `comparator` is
     attached to it. If the collection is in client mode, you can attach a
     comparator toPageableCollection#fullCollection to have all the pages
     reflect the global sorting order by specifying an option `full` to
     `true`. You __must__ call `sort` manually
     orPageableCollection#fullCollection.sort after calling this method to
     force a resort.

     While you can use this method to sort the current page in server mode,
     the sorting order may not reflect the global sorting order due to the
     additions or removals of the records on the server since the last
     fetch. If you want the most updated page in a global sorting order, it is
     recommended that you set PageableCollection#state.sortKey and optionally
     PageableCollection#state.order, and then callPageableCollection#fetch.

     @protected

     @param {string} sortKey = this.state.sortKey - See `state.sortKey`.
     @param {number} order = this.state.order - See `state.order`.
     @param {(function(Backbone.Model, string): Object) | string} sortValue -
     See PageableCollection#setSorting.

     See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
     */
    _makeComparator:function(a,b,c){var d=this.state;if(a=a||d.sortKey,b=b||d.order,a&&b)return c||(c=function(a,b){return a.get(b)}),function(d,e){var f,g=c(d,a),h=c(e,a);return 1===b&&(f=g,g=h,h=f),g===h?0:g<h?-1:1}},/**
     Adjusts the sorting for this pageable collection.

     Given a `sortKey` and an `order`, sets `state.sortKey` and
     `state.order`. A comparator can be applied on the client side to sort in
     the order defined if `options.side` is `"client"`. By default the
     comparator is applied to thePageableCollection#fullCollection. Set
     `options.full` to `false` to apply a comparator to the current page under
     any mode. Setting `sortKey` to `null` removes the comparator from both
     the current page and the full collection.

     If a `sortValue` function is given, it will be passed the `(model,
     sortKey)` arguments and is used to extract a value from the model during
     comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
     used for sorting.

     @chainable

     @param {string} sortKey - See `state.sortKey`.
     @param {number} order=this.state.order - See `state.order`.
     @param {Object} options
     @param {string} options.side - By default, `"client"` if `mode` is
     `"client"`, `"server"` otherwise.
     @param {boolean} options.full = true
     @param {(function(Backbone.Model, string): Object) | string} options.sortValue
     */
    setSorting:function(a,b,c){var d=this.state;d.sortKey=a,d.order=b=b||d.order;var e=this.fullCollection,g=!1,h=!1;a||(g=h=!0);var i=this.mode;c=f({side:"client"==i?i:"server",full:!0},c);var j=this._makeComparator(a,b,c.sortValue),k=c.full,l=c.side;return"client"==l?k?(e&&(e.comparator=j),g=!0):(this.comparator=j,h=!0):"server"!=l||k||(this.comparator=j),g&&(this.comparator=null),h&&e&&(e.comparator=null),this}}),A=z.prototype;return z});