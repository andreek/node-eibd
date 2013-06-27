module.exports = Encoder;
/**
 * Implements encode methods for dpt types
 */
function Encoder() {
}

/**
 * encode eis 8 / dpt 2 values
 */
Encoder.prototype.encodeDPT2 = function(buffer) {
  return buffer.readUInt8(0) & 0x3;
}

/**
 * encode eis 2 / dpt 3 values
 */
Encoder.prototype.encodeDPT3 = function(buffer) {
  return buffer.readUInt8(0) & 0xf;
};

/**
 * encode eis 13 / dpt 4 values
 */;
Encoder.prototype.encodeDPT4 = function(buffer) {
  var value = buffer.readUInt8(0);
  if(value <= 127) {
    value = buffer.toString('ascii', 0);
  } else {
    value = buffer.toString('utf8', 0);
  }
  return value;
};

/**
 * encode eis 14 / dpt 5 values
 */
Encoder.prototype.encodeDPT5 = function(buffer) {
  var data = buffer.readUInt8(0);
  return data;
};

/**
 * encode eis 5 / dpt 9 values
 */
Encoder.prototype.encodeDPT9 = function(buffer) {
  var value = buffer.readUInt16BE(0);

  var sign = (value & 0x8000) >> 15;
  var exp = (value & 0x7800) >> 11;
  var mant = (value & 0x07ff);

  if(sign != 0) {
    mant = -(~(mant - 1) & 0x07ff);
  }
  value = (1 << exp) * 0.01 * mant;
  return value;
};

/**
 * encode value
 */
Encoder.prototype.encode = function(len, data, callback) {

  var err = null;
  var type = 'DPT1';
  var value = null;

  // eis 1 / dpt 1.xxx
  if(len === 8) {
    value = data-64;
    if(value > 1) {
      value = value-64;
    }
  }

  // eis 6 / dpt 5.xxx
  // assumption
  if(len === 9){
    type = 'DPT5';
    if(data.length === 1) {
      value = this.encodeDPT5(data);
    } else {
      err = new Error('Invalid data len for DPT5');
    }
  }

  // eis 5 / dpt 9.xxx
  // assumption
  if(len === 10) {
    type = 'DPT9';
    if(data.length === 2)
      value = this.encodeDPT9(data);
    else {
      err = new Error('Invalid data len for DPT9');
    }
  }

  if(callback) callback(err, type, value);
};
