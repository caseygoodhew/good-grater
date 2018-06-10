const expect = require('chai').expect;
const src = require('./src');
const utils = require('./utils')();
const _string = src('./node/string')
/*
describe('Test that value', function() {
    it('returns a string node value as a string', function(done) {
        const context = utils.mockContext({
            node: {
                value: 'Mario'
            }
        });

        const value = _value();
        value(context, (result) => {
            expect(result).to.equal('Mario');
            done();
        })
    });

    it('returns a numeric node value as a string', function(done) {
        const context = utils.mockContext({
            node: {
                value: 42
            }
        });

        const value = _value();
        value(context, (result) => {
            expect(result).to.equal('42');
            done();
        })
    });

    it('returns an undefined node value as undefined', function(done) {
        const context = utils.mockContext({
            node: {}
        });

        const value = _value();
        value(context, (result) => {
            expect(result).to.be.undefined;
            done();
        })
    });
});*/