const expect = require('chai').expect;
const _grater = require('../');
const memoryLoader = _grater.loaders.memory;

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
            selector: '.item',
            name: 'fruit',
            type: 'array',
            then: {
                attrib: 'href',
                type: 'attrib',
                then: {
                    type: 'resource',
                    then: [{
                        name: 'name',
                        type: 'string',
                        selector: '.name'
                    }, {
                        type: 'string',
                        selector: '.wieght',
                        then: [{
                            type: 'string',
                            match: /[0-9.]/g,
                            then: {
                                type: 'number',
                                name: 'wieght'
                            }
                        }, {
                            type: 'string',
                            name: 'units',
                            match: /[a-z]/gi
                        }]
                    }]
                }
            }
        }
    }

    it('watch the magic happen', function() {
        const grater = _grater({
            resourceLoader: memoryLoader(resource)
        });

        grater(config.tree, config.startWith, result => {
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
        });
    });
});