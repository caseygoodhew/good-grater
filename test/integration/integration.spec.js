const expect = require('chai').expect;
const _grater = require('../../');
//const memoryLoader = _grater.loaders.memory;

describe('Test that grater does what grater should do', function() {

    it('works with data, name', function(done) {
        _grater({}, grater => {
            const markup = '<body><div class="name">Apple</div></body>';

            grater({
                data: markup,
                name: 'result'
            }, result => {
                expect(result.result.html()).to.equal(markup);
                done();
            });
        });
    });

    it('works with data, select, name', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: `<body>${markup}</body>`,
                select: '.name',
                name: 'result'
            }, result => {
                expect(result.result.html()).to.equal(markup)
                testdone();
            });
        });
    });

    it('works with data, select, cast, name', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name">Apple</div></body>',
                select: '.name',
                cast: 'text',
                name: 'result'
            }, result => {
                expect(result).to.deep.equal({
                    result: 'Apple'
                });
                testdone();
            });
        });
    });

    it('works with data, select, attrib, cast, name', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name" weight="183 g">Apple</div></body>',
                select: '.name',
                attrib: 'weight',
                cast: 'text',
                name: 'result'
            }, result => {
                expect(result).to.deep.equal({
                    result: '183 g'
                });
                testdone();
            });
        });
    });

    it('works with data, select, attrib, match, cast, name', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name" weight="183 g">Apple</div></body>',
                select: '.name',
                attrib: 'weight',
                match: /[0-9]/g,
                cast: 'number',
                name: 'result'
            }, result => {
                expect(result).to.deep.equal({
                    result: 183
                });
                testdone();
            });
        });
    });

    it('works with a then node', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name" weight="183 g">Apple</div></body>',
                then: {
                    select: '.name',
                    attrib: 'weight',
                    match: /[0-9]/g,
                    cast: 'number',
                    name: 'result'
                }
            }, result => {
                expect(result).to.deep.equal({
                    result: 183
                });
                testdone();
            });
        });
    });

    it('works with a bunch of then nodes', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name" weight="183 g">Apple</div></body>',
                then: {
                    select: '.name',
                    then: {
                        attrib: 'weight',
                        then: {
                            match: /[0-9]/g,
                            then: {
                                cast: 'number',
                                then: {
                                    name: 'result'
                                }
                            }
                        }
                    }
                }
            }, result => {
                expect(result).to.deep.equal({
                    result: 183
                });
                testdone();
            });
        });
    });

    it('works with multiple thens', function(testdone) {
        _grater({}, grater => {

            const markup = '<div class="name">Apple</div>';

            grater({
                data: '<body><div class="name">Apple</div></body>',
                select: '.name',
                then: [{
                    cast: 'text',
                    attrib: 'class',
                    name: 'class'
                }, {
                    cast: 'text',
                    name: 'value'
                }]
            }, result => {
                expect(result).to.deep.equal({
                    value: 'Apple',
                    class: 'name'
                });
                testdone();
            });
        });
    });

    it('works when splitting results', function(testdone) {
        const markup = `
            <body>
                <div class="list">
                    <a class="item" href="item-1">Item One</a>
                    <a class="item" href="item-2">Item Two</a>
                </div>
            </body>`;

        const config = {
            data: markup,
            then: {
                select: '.list a.item',
                attrib: 'href',
                name: 'urls',
                cast: 'array',
                then: {
                    cast: 'html',
                    name: 'value'
                }
            }
        };

        _grater({}, grater => {

            grater(config, result => {
                expect(result).to.deep.equal({
                    urls: [{
                        value: 'item-1'
                    }, {
                        value: 'item-2'
                    }]
                });

                testdone();
            });

        });
    });

    it('works when it goes to', function(testdone) {
        const resource = {
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

        const markup = `
            <body>
                <div class="list">
                    <a class="item" href="item-1">Item One</a>
                    <a class="item" href="item-2">Item Two</a>
                </div>
            </body>`;

        const config = {
            data: markup,
            then: {
                select: '.list a.item',
                attrib: 'href',
                cast: 'array',
                name: 'fruit',
                goto: 'grater',
                then: [{
                    name: 'name',
                    select: '.name',
                    cast: 'text'
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

        _grater(_grater.loader.memory(resource), grater => {

            grater(config, result => {
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
                });
                testdone();
            });
        });
    });
});