'use strict';

var assert = require('assert'),
    Encoder = require('../lib/encoder.js');

var enc = null;

describe('Encoder', function() {
  
  before(function() {
    enc = new Encoder();
  });
  
  describe('DPT1 encode', function() {
    it('should encode DPT1 value', function() {
      var buffer = enc.encode('DPT1',0);
      assert.equal(buffer.readUInt8(0), 0);
      
      buffer = enc.encode('DPT1',1);
      assert.equal(buffer.readUInt8(0), 1);
      
      buffer = enc.encode('DPT1',5);
      assert.equal(buffer.readUInt8(0), 1);
      
      buffer = enc.encode('DPT1',6);
      assert.equal(buffer.readUInt8(0), 0);
    });
  });
  
    describe('DPT2 encode', function() {
    it('should encode DPT2 value', function() {
      var buffer = enc.encode('DPT2',0);
      assert.equal(buffer.readUInt8(0), 0);
      
      buffer = enc.encode('DPT2',3);
      assert.equal(buffer.readUInt8(0), 3);
      
      buffer = enc.encode('DPT2',4);
      assert.equal(buffer.readUInt8(0), 0);
      
        buffer = enc.encode('DPT2',5);
      assert.equal(buffer.readUInt8(0), 1);
    });
  });
  
    describe('DPT3 encode', function() {
    it('should encode DPT3 value', function() {
      var buffer = enc.encode('DPT3',0);
      assert.equal(buffer.readUInt8(0), 0);
      
      buffer = enc.encode('DPT3',15);
      assert.equal(buffer.readUInt8(0), 15);
      
      buffer = enc.encode('DPT3',16);
      assert.equal(buffer.readUInt8(0), 0);
      
      buffer = enc.encode('DPT3',17);
      assert.equal(buffer.readUInt8(0), 1);
    });
  });
  
   describe('DPT5 encode', function() {
    it('should encode DPT5 value', function() {
      var buffer = enc.encode('DPT5',40);
      assert.equal(buffer.readUInt8(0), 40);
    });
  });
  
  describe('DPT9 encode', function() {
    it('should encode DPT9 value', function() {
      var buffer = enc.encode('DPT9',40);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x13e8);
      
      buffer = enc.encode('DPT9.001',50);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x14e2);
    });
    
    it('should encode DPT9 floating value', function() {
      var buffer = enc.encode('DPT9',20.2);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x11F9);
      
      buffer = enc.encodeDPT9(20.2, 4);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x207E);
    });
    
    it('should encode DPT9 negative value', function() {
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
    });
      
    it('should not encode DPTNOTIMPLEMENTED', function() {
      var buffer = enc.encode('DPTNOTIMPLEMENTED', -5.08);
      assert.equal(buffer, undefined);
    });
       
  });
  
});
