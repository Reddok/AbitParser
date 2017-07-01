function queryNormalize(query) {
    var res = {};
    if(typeof query === 'object' && query !== null) {
        for(var key in query) {
            if(Object.prototype.hasOwnProperty.call(query, key)){
                if(key.slice(-2) === "[]"){
                    res[key.slice(0, -2)] = {$in: Array.isArray(query[key])? query[key] : [query[key]]};
                } else if(query[key].pattern){
                    res[key] = new RegExp(query[key].pattern, "i");
                } else {
                    res[key] = query[key];
                }
            }
        }


    }
    return res;
}


module.exports = queryNormalize;