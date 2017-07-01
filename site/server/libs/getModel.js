module.exports = (connect) => {
    return (type, year) => {
        return connect.model(type, year);
    }
};