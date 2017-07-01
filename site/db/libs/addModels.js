'use strict';

const schemas = {
        Region: require('../schemas/region'),
        Univer: require('../schemas/univer'),
        Spec: require('../schemas/spec'),
        Student: require('../schemas/student')
};

module.exports = (connectInstance, years)=> {
        years.forEach(year => {
                for(let schema in schemas) {
                        connectInstance.model(schema + year, schemas[schema]);
                }
        });
        return schemas;
};