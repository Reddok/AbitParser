module.exports = (parser, parseString) => {


    return (options, cb) => {
        const items = options.items;

        parser.push({
            items: Array.isArray(items)? items : [items],
            pattern: [
                {
                    selector: "#okrArea table[id^=vnzt] a",
                    type: "href"
                },
                "#okrArea table[id^=vnzt] a"
            ],
            callback: (err, res) => {

                if(err) return options.error && options.error(err);

                let names = res.results[1],
                    anchors = res.results[0],
                    parentId = parseString(res.parentData.url, 'o', '.html');

                anchors.forEach((anchor, i) => {
                    let body = {
                        name: names[i],
                        parsed_id: parseString(anchor, 'i', '.html'),
                        parent: parentId
                    };

                    options.success({type: 'Univer', body: body});
                });

                cb && cb(anchors);
            }
        });

    }
};