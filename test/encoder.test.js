var assert = require('assert'),
    Encoder = require('../lib/encoder.js');

var enc = null;

describe('Encoder', function() {
  
  before(function(done) {
    enc = new Encoder();
    done();
  });
  
     describe('DPT1 encode', function() {
    it('should encode DPT1 value', function(done) {
      var buffer = enc.encodeDPT5(true);
      assert.equal(buffer.readUInt8(0), 0x01);
      buffer = enc.encodeDPT5(false);
      assert.equal(buffer.readUInt8(0), 0x00);
      done();
    });
  });
  
   describe('DPT5 encode', function() {
    it('should encode DPT5 value', function(done) {
      var buffer = enc.encodeDPT5(40);
      assert.equal(buffer.readUInt8(0), 40);
      done();
    });
  });
  
  describe('DPT9 encode', function() {
    it('should encode DPT9 value', function(done) {
      var buffer = enc.encodeDPT9(40);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x13e8);
      
      buffer = enc.encodeDPT9(50);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x14e2);
      
      done();
    });
    
    it('should encode DPT9 floating value', function(done) {
      var buffer = enc.encodeDPT9(20.2);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x11F9);
      
      buffer = enc.encodeDPT9(20.2, 4);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x207E);
      
      done();
    });
    
    it('should encode DPT9 negative value', function(done) {
      var buffer = enc.encodeDPT9(-100.32, 4);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA58D);   
      
      buffer = enc.encodeDPT9(-175.84, 4);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA3B5);
      
      buffer = enc.encodeDPT9(-199.52, 4);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA321);
      
      buffer = enc.encodeDPT9(-200.32, 6);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xB6C7);
      
      buffer = enc.encodeDPT9(-5.08);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x9781);
      done();
    });
  });
  
});
