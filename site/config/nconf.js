const path = require("path"),
    nconf = require("nconf");

nconf.argv().env().file({ file: path.join(__dirname, "config.json") });

module.exports = {

    get: (key, cb) => {
        /*if(!cb) return;*/
        nconf.load((err) => {
            if(err) return cb(err);
            cb(null, nconf.get(key));
        });
    },

    set: (key, value, cb) => {

        nconf.set(key, value);
        nconf.save((err)=> {
                cb && cb(err || null);
        });

    }

};
