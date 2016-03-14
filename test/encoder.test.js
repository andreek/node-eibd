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
      assert.equal(value, 0x0FD0); // was: 0x13e8

      buffer = enc.encode('DPT9.001',50);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x14e2);
    });

    it('should encode DPT9 floating value', function() {
      var buffer = enc.encode('DPT9',20.2);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x07E4); // was 0x11F9

      buffer = enc.encode('DPT9',20.2);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x07E4);
    });

    it('should encode DPT9 negative value', function() {
      var buffer = enc.encode('DPT9',-100.32);
      var value = buffer.readUInt16BE(0);
      assert.equal(value, 0x9B1A);

      buffer = enc.encode('DPT9',-175.84);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA3B5);

      buffer = enc.encode('DPT9',-199.52);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA321);

      buffer = enc.encode('DPT9',-200.32);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0xA31C); // was: 0xB6C7

      buffer = enc.encode('DPT9',-5.08);
      value = buffer.readUInt16BE(0);
      assert.equal(value, 0x8604);
    });

    it('should not encode DPTNOTIMPLEMENTED', function() {
      var buffer = enc.encode('DPTNOTIMPLEMENTED', -5.08);
      assert.equal(buffer, undefined);
    });

  });

  describe('DPT10 encoder', function() {
    it('should encode DPT10 value', function(done) {

      var dayOfTheWeek = 2; // Tuesday -> 010
      var hour = 10; // 10 AM  ->  01010
      var minutes = 43;
      var seconds = 5;

      var buffer = enc.encode('DPT10', [dayOfTheWeek, hour, minutes, seconds]);
      var value0 = buffer.readUInt8(0); // Read the first octect
      var value1 = buffer.readUInt8(1); // Read the second octect
      var value2 = buffer.readUInt8(2);  // Read the third octect

      assert.equal(value0, 0x4A); // 01001010 = 4A
      assert.equal(value1, 0x2B); // 43 = 00101011 = 2B
      assert.equal(value2, 0x05); // 5 = 00000101 = 05

      done();
    });
  });

  describe('DPT11 encoder', function() {
    it('should encode DPT11 value', function(done) {

      var day = 2; // February -> 010
      var month = 10; // 10 day  -> A
      var year = 14; // 14 -> 0xE -> 00001110

      var buffer = enc.encode('DPT11', [day, month, year]);
      var value0 = buffer.readUInt8(0); // Read the first octect
      var value1 = buffer.readUInt8(1); // Read the second octect
      var value2 = buffer.readUInt8(2);  // Read the third octect

      assert.equal(value0, 0x02); // 00000010 = 2
      assert.equal(value1, 0x0A); // 10 = 00001010 = A
      assert.equal(value2, 0x0E); // 14 = 00001110 = 05

      done();
    });
  });

});
