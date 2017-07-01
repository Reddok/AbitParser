'use strict';

module.exports = (mail, logFactory) => {


    const log = logFactory(module);

    return (err) => {
        const message = err.message + '\n' + err.stack;

        mail('Site Notify', err.name, message);
        log('error', message, {type: err.name || 'Error'});

    };


};





