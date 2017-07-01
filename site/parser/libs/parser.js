
const Crawler = require('crawler'),
    async = require('async'),
    Emitter = require("events").EventEmitter,
    url = require('url'),
    c = new Crawler();

class Requests extends Emitter{
    constructor(concurrency) {
        super();
        this._queue = async.queue(request, concurrency || 50);
        this._queue.drain = () => this.emit("parser:end");
    }

    push(query) {
        query.items.forEach(item => {
            let data = typeof item === 'string'?  {url: item} : item;
            if(!(data && data.url)) return query.callback(new Error('You need provide an url for parser'));
            this._queue.push({url: data.url, data: data, pattern: query.pattern}, query.callback)
        });
    }

    pause() {
        !this._queue.paused && this._queue.pause();
    }

    resume() {
        this._queue.paused && this._queue.resume();
    }


}

function request(item, callback) {
    c.queue({
            uri: item.url,
            callback: (error, res, done) => {
                try{
                    if(error) throw error;
                    let results = parse(item.pattern, item.url,  res.$);
                    done();
                    callback(null, {results: results, parentData: item.data});
                } catch(err) {
                    console.log(`При обробці сторінки з ${item.url} сталась наступна помилка:`, err);
                    done();
                    callback(err);
                }
            }
        })
}


function parse(pattern, baseUrl, $) {
    pattern = Array.isArray(pattern)? pattern : [pattern];

    return pattern.map((queryParams) => {
        if(typeof queryParams === "string") queryParams = {selector: queryParams};
        let query = selectElements(queryParams.selector, $),
            result = [];

        query.each((index, value) => {
            let data;
            switch(queryParams.type) {
                case "href":
                    data = resolveUrl(baseUrl, $(value).prop('href'));
                    break;
                case "dom":
                    data = $(value);
                    break;
                default:
                    data = $(value).text();
            }
            result.push(data);
        });

        return result;

    });

}


function selectElements(str, $) {
    return $(str);
}

function resolveUrl(base, relate) {
    let baseParsed = url.parse(base),
        pathArr = baseParsed.pathname.split('/');

    if(relate.substr(0, 3) === '../') {
        pathArr.splice(-2, 2);
        return baseParsed.protocol + '//' + baseParsed.host + pathArr.join('/') + relate.slice(2);
    } else if(relate[0] === '/') {
        return baseParsed.protocol + '//' + baseParsed.host + relate;
    } else if(relate[0] === '.') {
        pathArr.pop();
        return baseParsed.protocol + '//' + baseParsed.host + pathArr.join('/') + relate.slice(1);
    } else {
        return baseParsed.protocol + '//' + baseParsed.host + pathArr.join('/') + "/" + relate;
    }

}

module.exports = Requests;

