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

  describe('DPT10 encoder', function() {
    it('should encode DPT10 value', function(done) {

      var dayOfTheWeek = 2; // Tuesday -> 010
      var hour = 10; // 10 AM  ->  01010
      var minutes = 43
      var seconds = 5;

      var buffer = enc.encodeDPT10(dayOfTheWeek, hour, minutes, seconds);
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
      var year = 14 // 14 -> 0xE -> 00001110

      var buffer = enc.encodeDPT11(day, month, year);
      var value0 = buffer.readUInt8(0); // Read the first octect
      var value1 = buffer.readUInt8(1); // Read the second octect
      var value2 = buffer.readUInt8(2);  // Read the third octect

      assert.equal(value0, 0x02); // 00000010 = 2
      assert.equal(value1, 0x0A); // 10 = 00001010 = A
      assert.equal(value2, 0x0E); // 14 = 00001110 = 05
2
      done();
    });
  });

});
