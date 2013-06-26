var assert = require('assert'),
    Encoder = require('../lib/encoder.js');

var enc = null;

describe('Encoder', function() {

  before(function(done) {
    enc = new Encoder();
    done();
  });
  describe('DPT1', function() {
    it('should encode DPT1 value 1', function(done) {
      var data = 65;
      enc.encode(8, data, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT1');
        assert.equal(value, 1);
        done();
      })
    }),
    it('should encode DPT1 value 0', function(done) {
      var data = 64;
      enc.encode(8, data, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT1');
        assert.equal(value, 0);
        done();
      })
    });
  });

  describe('DPT5', function() {
    it('should encode DPT5 value', function(done) {
      var buf = new Buffer(1);
      buf.writeUInt8(150, 0);
      enc.encode(9, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT5');
        assert.equal(value, 150);
        done();
      });
    }),
    it('should throw error if buffer wrong lenght', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(150, 0);
      buf.writeUInt8(151, 1);
      enc.encode(9, buf, function(err, type, value) {
        assert.equal(err.message, 'Invalid data len for DPT5');
        done();
      });
    });
  });

  describe('DPT9', function() {
    it('should encode DPT9 value', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0xa1, 0);
      buf.writeUInt8(0x44, 1);
      enc.encode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(parseInt(value), -275);
        done();
      });
    });
  });
});
