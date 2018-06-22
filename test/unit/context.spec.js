const expect = require('chai').expect;
const utils = require('./utils')();
const callCounter = utils.callCounter;

//const _context = require('./src')('./context');

describe('Test that context', function() {
    it('succeeds with one attribute created', function() {
        const context = _context(['one']);
        // initially undefined
        expect(context.one()).to.be.undefined;
        // generates a new context instance when setting a value
        const subcontext = context.one('value');
        // does not alter the initial instance
        expect(context.one()).to.be.undefined;
        // returns the expected value from the new instance
        expect(subcontext.one()).to.equal('value');
    });

    it('succeeds with two attributes created', function() {
        const context = _context(['one', 'two']);
        const contextOne = context.one('one');
        const contextTwo = context.two('two');
        const contextOneTwo = contextOne.two('two');
        const contextTwoOne = contextTwo.one('one');

        expect(context.one()).to.be.undefined;
        expect(context.two()).to.be.undefined;

        expect(contextTwo.one()).to.be.undefined;
        expect(contextTwo.two()).to.equal('two');

        expect(contextOneTwo.one()).to.equal('one');
        expect(contextOneTwo.two()).to.equal('two');

        expect(contextTwoOne.one()).to.equal('one');
        expect(contextTwoOne.two()).to.equal('two');
    });

    it('succeeds with one attribute created', function() {
        var context = _context(['one']);
        expect(context.one()).to.be.undefined;

        context = context.one('one');
        expect(context.one()).to.equal('one');

        context = context.set('one');
        expect(context.one()).to.be.undefined;

        context = context.one('one');
        expect(context.one()).to.equal('one');

        context = context.set('one', 'two');
        expect(context.one()).to.equal('two');

        context = context.set('one', undefined, 'three');
        expect(context.one()).to.equal('three');

        context = context.one({
            val: 'one'
        });
        expect(context.one()).to.deep.equal({
            val: 'one'
        });

        context = context.set('one', 'val', 'two');
        expect(context.one()).to.deep.equal({
            val: 'two'
        });

        context = context.set('one', 'val');
        const last = context.one();

        expect(last).to.deep.equal({
            val: undefined
        });
    });

    it('throws with invalid construction', function() {
        expect(() => _context()).to.throw(TypeError);
        expect(() => _context([])).to.throw(TypeError);
        expect(() => _context([42])).to.throw(TypeError);
        expect(() => _context([''])).to.throw(TypeError);
    });
});