module.exports = (parser, parseString) => {
    const basePath = 'table.tablesaw-sortable tr';

    return (options) => {
        const items = options.items,
            pattern = [
                'td:nth-child(2)',
                'td:nth-child(4)',
                'td:nth-child(5)',
                'td:nth-child(6)'
            ].map(select => basePath + " " + select);
        pattern.push({selector: basePath + " " + 'td:nth-child(1)', type: "dom"});

        parser.push({
            items: Array.isArray(items)? items : [items],
            pattern: pattern,
            callback: (err, res) =>  {

                if(err) return options.error || options.error(err);

                const names = res.results[0],
                    generalPoints = res.results[1],
                    attestPoints = res.results[2],
                    znoPoints = res.results[3],
                    domElemsTd = res.result[4],
                    parentId = parseString(res.parentData.url, 'p', '.html');

                names.forEach(function(name, i) {
                    let rank = domElemsTd,
                        body =  {
                            name: name,
                            enroll: defineEnroll(rank)? parentId : false,
                            statements: [{
                                generalPoints: parseFloat(generalPoints[i]),
                                attestPoints: attestPoints[i],
                                znoPoints: znoPoints[i],
                                place: rank.text(),
                                rank: definePoint(rank, res.parentData.concurs, res.parentData.places),
                                spec: parentId
                            }]
                         };
                    if(defineEnroll(rank)) body.enroll = parentId;
                    options.success({type: 'Student', body: body})
                });

            }
        });

    }


};

/*Функція яка на основі того, в яку группу абітуріентів попадає людина(чи попадає на безп. місця або чи взагалі проходить) виставляю якусь абтрактну оцінку можливості вступу*/

function defineEnroll(elem) {
    if(elem.css("background")) return true;
}

function definePoint(rank, DZplaces, allPlaces) {

    if(defineEnroll(rank)) return "enrolled";
    if(rank <= DZplaces) {
        return "free"
    } else if(rank <= allPlaces){
        return "cost"
    } else {
        return "out";
    }
}