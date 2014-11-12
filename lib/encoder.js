module.exports = Encoder;
/**
 * Implements encode methods for dpt types
 */
function Encoder() {
}

/**
 * encode dpt 5 values
 */
Encoder.prototype.encodeDPT5 = function(value) {
  var buffer = new Buffer(1);
  buffer.writeUInt8(value, 0);
  return buffer;
};

/**
 * encode 9 values
 */;
Encoder.prototype.encodeDPT9 = function(value, exp) {
  var data = [0,0];
  
  if(exp == undefined) {
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
  
  //fil in mant
  data[0] |= (mant >> 8) & 0x7;
  data[1] |= mant & 0xFF;
  
  var buffer = new Buffer(2);
  buffer.writeUInt8(data[0], 0);
  buffer.writeUInt8(data[1], 1);
  return buffer;
};

Encoder.prototype.encode = function(DPTType, value) {
	if(DPTType.indexOf('DPT5') == 0) {
		return this.encodeDPT5(value);
	} else if(DPTType.indexOf('DPT9') == 0) { 
		return this.encodeDPT9(value);
	}
    return undefined;
}
