module.exports = (parser, parseString) => {

    return (options, cb) => {
        const items = options.items;
        parser.push({
            items: Array.isArray(items)? items : [items],
            pattern: [
                {
                    selector: '#abet td:first-child a',
                    type: "href"
                },
                '#abet td:first-child a'
            ],
            callback: (err, res) => {
                console.log("callback regions");
                if(err) return options.error(err);

                let anchors = res.results[0],
                    names =  res.results[1];

                anchors.forEach((anchor, i) => {
                    options.success({type: 'Region', body: { name: names[i], parsed_id: parseString(anchor, 'o', '.html') }});
                });

                cb(anchors);
            }
        });
    }

}


