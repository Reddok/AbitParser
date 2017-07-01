class Free {

    constructor(context) {
        this.context = context;
    }

    get(key, cb) {
        this.context.strategy.get.apply(this.context.strategy, arguments);
    }

    set(key) {
        this.context.busyKeys[key] = true;
        this.context.set.apply(this.context, arguments);
    }

}

module.exports = Free;