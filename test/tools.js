'use strict';

var assert = require('assert'),
    tools = require('../lib/tools.js');

describe('Tools tests', function() {

  it('should create convert a m/exp DPT-9 to positive float and back', function() {
      var m = 1234;
      var exp = 2;
      var float1 = tools.convertToFloat(m, exp);
      var test = tools.convertFromFloat(float1);
      assert.equal(m, test[0]);
      assert.equal(exp, test[1]);
  });

  it('should create convert a positive float m/exp DPT-9  and back', function() {
      var float1 = 1244.22;
      var test = tools.convertFromFloat(float1);
      var float2 = tools.convertToFloat(test[0], test[1]);
      assert.equal(float1, float2);
  });

  it('should create convert a negative float m/exp DPT-9  and back', function() {
      var float1 = -12442.23;
      var test = tools.convertFromFloat(float1);
      var float2 = tools.convertToFloat(test[0], test[1]);
      assert.equal(float1, float2);  });
});
