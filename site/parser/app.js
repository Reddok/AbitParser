'use strict';

const Emitter = require('events').EventEmitter,
    diContainerFactory = require("./libs/diContainer"),
    patterns = {
        date: /\d{1,2}\/\d{1,2}\/\d{1,2} o \d{1,2}:\d{1,2}/,
        year: /\d{4}/,
        archive: /архів/
    };



module.exports = (config, logFactory, errorHandler) => {

    const log = logFactory(module);

    class Parser extends Emitter {

        constructor() {
            super();

            this._parser = new (require('./libs/parser'));
            this.isParsing = false;

            this._diContainer = diContainerFactory();
            this._diContainer.register("ParserError", require("./libs/error"));
            this._diContainer.register("parseString", require("./libs/string"));
            this._diContainer.register("parser", this._parser);
            this._diContainer.factory("findRegions", require("./targets/region"));
            this._diContainer.factory("findUnivers", require("./targets/univer"));
            this._diContainer.factory("findSpecs", require("./targets/spec"));
            this._diContainer.factory("findStudents", require("./targets/student"));

            this.on('parser:pause', this.pause.bind(this));
            this.on('parser:resume', this.resume.bind(this));
        }

        start(baseUrl) {
            if(this.isParsing) return  log('debug', "I'm parse already.");
            this.isParsing = true;
            this._initializeParsing(baseUrl);
            log('debug', 'Start parsing');
        }

        pause()  {this._parser.pause()};
        resume() {this._parser.resume()};

        _initializeParsing(url) {
            if(!url) throw new Error("You must provide base url");
            this._parser.push({
                items: [url],
                pattern: ['.title-page small', '.title-page .title-description'],
                callback: (err, res) => {
                    if(err) return this._errorHandler(err);

                    const titleString = res.results[0][0],
                        descriptionString = res.results[1][0],
                        date = extract(titleString, patterns.date);

                    this._updateYearArchives(descriptionString)
                        .then(this._isNeededParse.bind(this, date))
                        .then(flag => {
                            if(flag) {
                                this._currentUpdate = date;
                                this._parse(url);
                            } else {
                                this._refuseParsing()
                            }
                        })
                        .catch(this._errorHandler.bind(this));
                }
            });
        }

        _endParsing() {
            if(this._currentUpdate) config.set("parser:siteUpdated", this._currentUpdate)
                .then(() => delete this._currentUpdate)
                .catch(this._errorHandler.bind(this));
            this.emit('parser:finish');
            this.isParsing = false;
        }

        _sendData(data) {
            this.emit('get:parsed:data', data)
        }

        _parse(url) {
            this._parser.on("parser:end", this._endParsing.bind(this));
            this._createRequest('findRegions', url, (res) => {
                this._createRequest('findUnivers', res, (res) => {
                    this._createRequest('findSpecs', res, (res) => {
                        this._createRequest('findStudents', res);
                    })
                });
            });
        }

        _refuseParsing() {
            this.emit("parser:refuse");
            log("info", "Дані не обновлялись, нема потреби робити парсинг.");
            this._endParsing();
        }

        _updateYearArchives(string) {
            const year = extract(string, patterns.year);

            return config.get("yearArchives").then((archivesYears) => {
                if (!~archivesYears.indexOf(year)) {
                    archivesYears.push(year);
                    return config.set("yearArchives", archivesYears);
                }
            }).then(() => {
                if(!~string.search(patterns.archive)) return config.set("activeYear", year + 1);
            });
        }

        _isNeededParse(date) {
            config.get("parser:siteUpdated").then((lastUpdated) => lastUpdated).then((lastUpdated) => {
                return date !== lastUpdated;
            });
        }

        _createRequest(address, data, cb) {
                let options = Object.assign({}, {success: this._sendData.bind(this), error: this._errorHandler.bind(this)}, {items: data});
                return this._diContainer.get(address)(options, cb);
        }

        _errorHandler(err) {
            let ParserError = this._diContainer.get("ParserError");
            errorHandler(new ParserError(err.message, err.stack));
        }
    }

    return Parser;

    function extract(data, pattern) {
        return data.match(pattern)[0];
    }

};



