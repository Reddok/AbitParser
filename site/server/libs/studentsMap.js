const mapRank = {
    free: 2,
    cost: 1,
    out: 0.5
},
    strategies = {
        single: (obj, spec, res) => {
            res.statement = findStatement(obj.statements, spec);

            if(typeof obj.enrolled !== "undefined") res.chance = res.statement.spec === obj.enrolled? 100 : 0;
            else res.chance = calcChance(res.statement.rank, calcSum(obj.statements));

        },
        all: (obj, res) => {
            if(typeof obj.enrolled !== "undefined") obj.statements.forEach(stat => stat.chance = stat.spec === obj.enrolled? 100 : 0);
            else obj.statements.forEach(stat => stat.chance = calcChance(stat.rank, calcSum(obj.statements)));

            res.statements = obj.statements;
        },

        count: (obj, res) => {
            return res.statements = obj.statements.length;
        },

        singleDated: (obj, spec, res) => {
            res.statement = findStatement(obj.statements, spec);
            res.chance = typeof obj.enrolled !== "undefined" && res.statement.spec === obj.enrolled? 100 : 0;
        },

        allDated: (obj, res) => {
            obj.statements.forEach(stat => stat.chance = typeof obj.enrolled !== "undefined" && stat.spec === obj.enrolled? 100 : 0);
            res.statements = obj.statements;
        }
    };

/*helper functions*/

function calcChance(rank, sum) {
    return Math.round((mapRank[rank]/sum)*100);
}

function calcSum(statements) {
    return statements.reduce((prev, current) => prev + mapRank[current.rank], 0);
}

function findStatement(statements, specId) {
    var statement;
    statements.some((stat) => {
        statement = stat;
        return statement.spec === specId;
    });
    return statement;
}

/* ... */

module.exports = (mod, obj, spec)  => {
    const res = {},
        strategy = strategies[mod],
        args = Array.prototype.slice.call(arguments, 1).concat(res);

    if(strategy) strategy.apply(null, args);

    res._id = obj._id;
    res.name = obj.name;

    return res;
};