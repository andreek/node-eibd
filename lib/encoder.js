'use strict';
/**
 * Implements encode methods for dpt types
 */
function Encoder() {
}

/**
 * encode dpt 1 values
 */
Encoder.prototype.encodeDPT1 = function(value) {
  var buffer = new Buffer(1);
  buffer.writeUInt8(value & 0x1, 0);
  return buffer;
};

/**
 * encode dpt 2 values
 */
Encoder.prototype.encodeDPT2 = function(value) {
  var buffer = new Buffer(1);
  buffer.writeUInt8(value & 0x3, 0);
  return buffer;
};

/**
 * encode dpt 3 values
 */
Encoder.prototype.encodeDPT3 = function(value) {
  var buffer = new Buffer(1);
  buffer.writeUInt8(value & 0xF, 0);
  return buffer;
};

/**
 * encode dpt 5 values
 */
Encoder.prototype.encodeDPT5 = function(value) {
  var buffer = new Buffer(1);
  buffer.writeUInt8(value & 0xFF, 0);
  return buffer;
};

/**
 * encode 9 values
 */
Encoder.prototype.encodeDPT9 = function(value, exp) {
  var data = [0,0];
  
  if(exp === undefined) {
    exp = 2;
  }
  
  var mant = value * 100 / (1 << exp);
  
  //Fill in sign bit
  if(value < 0) {
    data[0] |= 0x80;
    mant = (~(mant * -1) + 1) & 0x07ff;
  }
  
  //Fill in exp (4bit)
  data[0] |= (exp & 0x0F) << 3;
  
  //Fill in mant
  data[0] |= (mant >> 8) & 0x7;
  data[1] |= mant & 0xFF;
  
  var buffer = new Buffer(2);
  buffer.writeUInt8(data[0], 0);
  buffer.writeUInt8(data[1], 1);
  return buffer;
};

Encoder.prototype.encode = function(DPTType, value) {
    if(DPTType.indexOf('DPT1') === 0) {
		return this.encodeDPT1(value);
	} else if(DPTType.indexOf('DPT2') === 0) { 
		return this.encodeDPT2(value);
	} else if(DPTType.indexOf('DPT3') === 0) {
		return this.encodeDPT3(value);
	} else if(DPTType.indexOf('DPT5') === 0) {
		return this.encodeDPT5(value);
	} else if(DPTType.indexOf('DPT9') === 0) { 
		return this.encodeDPT9(value);
	}
    return undefined;
};

module.exports = Encoder;