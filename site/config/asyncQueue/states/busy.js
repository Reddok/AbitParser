class Busy {

    constructor(context) {
        this.context = context;
        this.queuedCallbacks = {};
        this.queuedUpdates = {};
    }

    get(key, cb) {
        if(!cb) return;
        if(!this.queuedCallbacks[key]) this.queuedCallbacks[key] = [];
        this.queuedCallbacks[key].push(cb);
    }

    set(key, value, cb) {
        let isUpdated = this.queuedUpdates[key];

        if(!isUpdated) this.queuedUpdates[key] = [];
        this.queuedUpdates[key].push({val: value, callback: cb});
        if(!isUpdated) this._save(key);
    }

    _save(key) {

        let update = this.queuedUpdates[key].shift();

        this.context.strategy.set(key, update.val, (err)=> {
            update.callback && update.callback(err || null);
            if(this.queuedUpdates[key].length) return this._save(key);
            this._flush(key);
        });
    }

    _flush(key) {
        delete this.queuedUpdates[key];
        delete this.context.busyKeys[key];

        if(!this.queuedCallbacks[key]) return;

        this.queuedCallbacks[key].forEach(cb => this.context.get(key, cb));
        delete this.queuedCallbacks[key];
    }

}

module.exports = Busy;