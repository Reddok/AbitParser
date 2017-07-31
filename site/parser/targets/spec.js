module.exports = (parser, parseString) => {

    return (options, cb) => {
        const items = options.items;

        parser.push({
            items: Array.isArray(items)? items : [items],
            pattern: (() => {
                let res = [];
                ["#denna1", "#zaoch1"].forEach((item) => {
                   res.push.apply(res, [
                       {selector: `${item} td:nth-child(2) a.button-mini`, type: 'href'},
                       `${item} td:nth-child(1)`,
                       `${item} td:nth-child(3) nobr:first-child`,
                       `${item} td:nth-child(3) nobr:last-child`,
                       `${item} td:nth-child(2)>span`
                   ]);
                });
                return res;
            })(),
            callback: (err, res) =>  {

                if(err) return options.error && options.error(err);

                let itemsDenn = handleResults(res.results.slice(0, 5), res.parentData.url, options.success, "denna"),
                    itemsZaoch = handleResults(res.results.slice(5, 10), res.parentData.url, options.success, "zaoch");

                cb && cb(itemsDenn.concat(itemsZaoch));


            }})

    }



    function handleResults(input, url, sendFunc, typeSpec) {
        let anchors = input[0],
            names = input[1],
            places = input[2],
            concurs = input[3],
            requests = input[4],
            parentId = parseString(url, 'i', '.html'),
            countId = 0,
            items = [];

        names.forEach(function(name, i) {

            let regexp = /\w+/, /*просто вибирати цифри зі строки*/
                currentRequests = +requests[i].match(regexp)[0],
                currentPlaces = +places[i].match(regexp)[0],
                anchor, currentConcurs ;

            currentConcurs = concurs[i].match(regexp);

            if( !currentConcurs || concurs[i] === places[i] ) {
                currentConcurs = 0;
            } else {
                currentConcurs = +currentConcurs[0];
            }

            if(currentRequests) anchor = anchors[countId++];

            if(anchor) items.push({
                url: anchor,
                concurs: currentConcurs,
                places: currentPlaces
            });


            sendFunc({type: 'Spec', body: {
                name: name,
                concurs: currentConcurs,
                places: currentPlaces,
                specType: typeSpec,
                parsed_id: anchor? parseString(anchor, 'p', '.html') : '-',
                parent: parentId
            }});

        });

        return items;

    }




};

