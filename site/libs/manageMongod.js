'use strict';
const child = require('child_process'),
    fs = require('fs');



class Mongod {

    constructor(options) {
        this._mongoPath = options.mongoPath || 'C:/Program files/mongodb/server/3.2/bin';
        this.dbDirPath = options.dirPath;
        this._maxAttempts = options.maxAttempts || 10;
        this._currentAttempt = 1;
    }

    start() {
        if(!this._prom) this._prom = new Promise((res, rej) => {
                console.log("Запускаю процес");
                this._start(res, rej);
        });

        return this._prom;
    }

    _start(res, rej) {

        let options = this.dbDirPath? ['--dbpath', this.dbDirPath] : [],
            timer = setTimeout(res, 5000);
        this._process = child.spawn('mongod', options, {cwd: this._mongoPath});

        this._process.once('error', err => console.log('Database failed with error: ', err));
        this._process.once('close', (code) => {

            switch(code) {
                case 1:
                    console.log('Database closed with code: ' + code);
                    break;
                case 48:
                    console.log("Database already running");
                    res();
                    break;
                default:
                    res();/*
                    console.log('Database failed with code: ' + code);
                    clearTimeout(timer);
                    if(this._currentAttempt++ <= this._maxAttempts) setTimeout(this._start.bind(this, res, rej), 500);
                    else {
                        console.log('Database died');
                        this._prom = null;
                        this._currentAttempt = 1;
                        rej();
                    }*/
            }

        });
    }

    exit() {
        let isWin = /^win/.test(process.platform),
            prom = Promise.resolve();

        if (isWin)  prom = prom.then(() => { return winKill(this._process.pid) });
        else prom = prom.then(() => { return unixKill(this._process.pid)});

        return prom.then(() => {
            this._prom = this._process = null;
        });
    }

    restart() {
        let prom = this._process? this.exit() : Promise.resolve();
        return prom.then(() => { return this.start() });
    }


}

module.exports = Mongod;


function winKill(pid) {
    return new Promise((res) => {
        child.exec('taskkill /PID ' + pid + ' /T /F', (err) => {
            if(err) console.log('exiting failed with', err);
            else console.log('exiting succeed');
            res();
        });
    })
}

function unixKill(pid, signal) {
    signal = signal || 'SIGKILL';
    psTree(pid, (err, children) => {
        [pid].concat(
            children
                .map(p => p.PID)
                .forEach(tpid => {
                    try { process.kill(tpid, signal) }
                    catch (err) { console.log('exiting failed with', err) }
                })
        );
    });
    return Promise.resolve();
}