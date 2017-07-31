'use strict';

 let app = new (require('./app'));

 app.on('init', app.start.bind(app));

