var assert = require('assert'),
    Decoder = require('../lib/decoder.js');

var enc = null;

describe('Decoder', function() {

  before(function(done) {
    enc = new Decoder();
    done();
  });
  describe('DPT1', function() {
    it('should decode DPT1 value 1', function(done) {
      var data = 65;
      enc.decode(8, data, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT1');
        assert.equal(value, 1);
        done();
      })
    }),
    it('should decode DPT1 value 0', function(done) {
      var data = 64;
      enc.decode(8, data, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT1');
        assert.equal(value, 0);
        done();
      })
    });
  });

  describe('DPT5', function() {
    it('should decode DPT5 value', function(done) {
      var buf = new Buffer(1);
      buf.writeUInt8(150, 0);
      enc.decode(9, buf, function(err, type, value) {
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
      enc.decode(9, buf, function(err, type, value) {
        assert.equal(err.message, 'Invalid data len for DPT5');
        done();
      });
    });
  });

  describe('DPT9', function() {
    it('should decode DPT9 float value - exponent4', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0xA3, 0);
      buf.writeUInt8(0xB5, 1);
      enc.decode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(Math.round(value * 100) / 100, -175.84);
        done();
      });
    });
    
    it('should decode DPT9 float value - exponent4', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0xA5, 0);
      buf.writeUInt8(0x8D, 1);
      enc.decode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(Math.round(value * 100) / 100, -100.32);
        done();
      });
    });
    
    it('should decode DPT9 float value - exponent4', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0xA3, 0);
      buf.writeUInt8(0x21, 1);
      enc.decode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(Math.round(value * 100) / 100, -199.52);
        done();
      });
    });
    
     it('should decode DPT9 float value - exponent6', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0xB6, 0);
      buf.writeUInt8(0xC7, 1);
      enc.decode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(Math.round(value * 100) / 100, -200.32);
        done();
      });
    });
    
    it('should decode DPT9 float value - exponent2', function(done) {
      var buf = new Buffer(2);
      buf.writeUInt8(0x97, 0);
      buf.writeUInt8(0x81, 1);
      enc.decode(10, buf, function(err, type, value) {
        assert.equal(err, null);
        assert.equal(type, 'DPT9');
        assert.equal(Math.round(value * 100) / 100, -5.08);
        done();
      });
    });
    
  });
});
