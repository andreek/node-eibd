module.exports = Encoder;
/**
 * Implements encode methods for dpt types
 */
function Encoder() {
}

/**
 * encode eis 5 / dpt 9 values
 */
Encoder.prototype.encodeEIS5 = function(buffer) {
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

  // eis 1 / dpt 1.xxx
  if(len === 8) {
    data = data-64;
    if(data > 1) {
      data = data-64;
    }
  }

  // eis 6 / dpt 5.xxx
  // assumption
  if(len === 9){
    type = 'DPT5';
    if(data.length === 1)
      data = data.readUInt8(0);
    else {
      err = new Error('Invalid data len for DPT5');
    }
  }

  // eis 5 / dpt 9.xxx
  // assumption
  if(len === 10) {
    type = 'DPT9';
    data = this.encodeEIS5(data);
  }

  if(callback) callback(err, type, data);
};
