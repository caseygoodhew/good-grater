const expect = require('chai').expect;
const _grater = require('../../');
//const memoryLoader = _grater.loaders.memory;

describe('Test that grater does what grater should do', function() {

    const resource = {
        'main': `
            <body>
                <div class="list">
                    <a class="item" href="item-1">Item One</a>
                    <a class="item" href="item-2">Item Two</a>
                </div>
            </body>`,
        'item-1': `
            <body>
                <div class="name">Apple</div>
                <div class="wieght">183 g</div>
            </body>`,
        'item-2': `
            <body>
                <div class="name">Watermelon</div>
                <div class="wieght">2.5 kg</div>
            </body>`
    };

    const config = {
        startWith: 'main',
        tree: {
            select: '.list a.item',
            attrib: 'href',
            follow: true,
            name: 'fruit',
            then: [{
                name: 'name',
                select: '.name'
            }, {
                select: '.wieght',
                then: [{
                    match: /[0-9.]/g,
                    cast: 'number',
                    name: 'wieght'
                }, {
                    name: 'units',
                    match: /[a-z]/gi
                }]
            }]
        }
    };

    const simple = {
        data: `
            <body>
                <div class="name">Apple</div>
                <div class="wieght">183 g</div>
            </body>`,
        then: {
            name: 'name',
            select: '.name'
        }
    }


    it('watch the magic happen', function() {
        return;

        const grater = _grater({
            //resourceLoader: memoryLoader(resource)
        });

        debugger;

        grater(simple, result => {
            debugger;
            expect(result).to.deep.equal({})
        });

        /*grater(config.tree, config.startWith, result => {
            expect(result).to.deep.equal({
                "fruit": [{
                        "name": "Apple",
                        "wieght": 183,
                        "units": "g"
                    },
                    {
                        "name": "Watermelon",
                        "wieght": 2.5,
                        "units": "kg"
                    }
                ]
            })
        });*/
    });
});