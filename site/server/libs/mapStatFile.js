let baseUrl = '';

function staticMap(name){
    return baseUrl + name;
};

staticMap.getBaseUrl = () => {
    return baseUrl;
};

module.exports = staticMap;