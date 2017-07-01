"use strict";


module.exports.getDate = (date, splitter) => {
    let dateObj = splitDate(date);
    splitter || (splitter = '/');
    return dateObj.days + splitter + dateObj.months + splitter + dateObj.year;
};

module.exports.getTime = (date, splitter) => {
    let dateObj = splitDate(date);
    splitter || (splitter = ':');
    return dateObj.hours + splitter + dateObj.minutes + splitter + dateObj.seconds;
};

function splitDate(date) {
    let dateObj = {
        year: date.getFullYear(),
        seconds: date.getSeconds(),
        minutes: date.getMinutes(),
        hours: date.getHours(),
        days: date.getDate(),
        months: date.getMonth() + 1
    };

    for(let val in dateObj) {
        if(dateObj.hasOwnProperty(val) && dateObj[val] < 10) dateObj[val] = '0' + dateObj[val];
    }

    return dateObj;

}