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

    it('works with data, name', function() {
        const grater = _grater({});

        const markup = '<body><div class="name">Apple</div></body>';

        grater({
            data: markup,
            name: 'result'
        }, result => {
            expect(result.result.html()).to.equal(markup)
        });
    });

    it('works with data, select, name', function() {
        const grater = _grater({});

        const markup = '<div class="name">Apple</div>';

        grater({
            data: `<body>${markup}</body>`,
            select: '.name',
            name: 'result'
        }, result => {
            expect(result.result.html()).to.equal(markup)
        });
    });

    it('works with data, select, cast, name', function() {
        const grater = _grater({});

        const markup = '<div class="name">Apple</div>';

        grater({
            data: '<body><div class="name">Apple</div></body>',
            select: '.name',
            cast: 'text',
            name: 'result'
        }, result => {
            expect(result).to.deep.equal({
                result: 'Apple'
            })
        });
    });

    it('works with data, select, attrib, cast, name', function() {
        const grater = _grater({});

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
            })
        });
    });

    it('works with data, select, attrib, match, cast, name', function() {
        const grater = _grater({});

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
            })
        });
    });

    it('works with a child node', function() {
        const grater = _grater({});

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
            })
        });
    });

    it('works with a bunch of child nodes', function() {
        const grater = _grater({});

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
            })
        });
    });
});