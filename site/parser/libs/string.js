module.exports = (url, startLetter, endLetter) => {
     let start = returnPosition(url, startLetter, true),
         end = returnPosition(url, endLetter);
    return url.slice(start, end);

};

function returnPosition(string, sub, isStart) {

    if(typeof string === "string" || typeof sub === "string") {
        let position = string.lastIndexOf(sub);
        if(~position) return isStart? position + sub.length : position;
    }
    return isStart? 0 : string.length;

}
