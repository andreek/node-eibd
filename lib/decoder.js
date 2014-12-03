'use strict';

/**
 * Implements decode methods for dpt types
 */
function Decoder() {
}

/**
 * decode eis 8 / dpt 2 values
 */
Decoder.prototype.decodeDPT2 = function(buffer) {
  var data = buffer.readUInt8(0) & 0x3;
  return data;
};

/**
 * decode eis 2 / dpt 3 values
 */
Decoder.prototype.decodeDPT3 = function(buffer) {
  var data = buffer.readUInt8(0) & 0xf;
  return data;
};

/**
 * decode eis 13 / dpt 4 values
 */
Decoder.prototype.decodeDPT4 = function(buffer) {
  var value = buffer.readUInt8(0);
  if(value <= 127) {
    value = buffer.toString('ascii', 0);
  } else {
    value = buffer.toString('utf8', 0);
  }
  return value;
};

/**
 * decode eis 14 / dpt 5 values
 */
Decoder.prototype.decodeDPT5 = function(buffer) {
  var data = buffer.readUInt8(0);
  return data;
};

/**
 * decode eis 14 / dpt 6 values
 */
Decoder.prototype.decodeDPT6 = function(buffer) {
  var data = buffer.readInt8(0);
  return data;
};

/**
 * decode EIS 10 / dpt 7 values
 */
Decoder.prototype.decodeDPT7 = function(buffer) {
  var value = buffer.readUInt16BE(0);
  return value;
};

/**
 * decode EIS 10.001 / dpt 8 values
 */
Decoder.prototype.decodeDPT8 = function(buffer) {
  var value = buffer.readInt16BE(0);
  return value;
};

/**
 * decode eis 5 / dpt 9 values
 */
Decoder.prototype.decodeDPT9 = function(buffer) {
  var value = buffer.readUInt16BE(0);

  var sign = (value & 0x8000) >> 15;
  var exp = (value & 0x7800) >> 11;
  var mant = (value & 0x07ff);

  if(sign !== 0) {
    mant = -(~(mant - 1) & 0x07ff);
  }
  value = (1 << exp) * 0.01 * mant;
  return value;
};

/**
 * decode eis 3 / dpt 10 values
 */
Decoder.prototype.decodeDPT10 = function(buffer) {

  var value = new Date();

  var weekDay = (buffer[0] & 0xe0) >> 5;
  var hour = buffer[0] & 0x1f;
  var min = buffer[1] & 0x3f;
  var sec = buffer[2] & 0x3f;

  value.setHours(hour);
  value.setMinutes(min);
  value.setSecondes(sec);
  var currentDay = value.getDay();
  if(currentDay !== weekDay) {
    if(currentDay > weekDay) {
      value.setDate(value.getDate() + (weekDay - currentDay));
    } else {
      value.setDate(value.getDate() - (weekDay - currentDay));
    }
  }
  return value;
};

/**
 * decode eis 4 / dpt 11 values
 */
Decoder.prototype.decodeDPT11 = function(buffer) {

  var day = buffer[0] & 0x1f;
  var mon = buffer[1] & 0xf;
  var year = buffer[2] & 0x7f;

  if(year < 90) {
    year += 2000;
  } else {
    year += 1900;
  }
 
  var value = new Date(year, mon, day);

  return value;
};

/**
 * decode eis 11 / dpt 12 values
 */
Decoder.prototype.decodeDPT12 = function(buffer) {

  var value = buffer.readUInt32BE(0);
  return value;

};

/**
 * decode eis 11.001 / dpt 13 values
 */
Decoder.prototype.decodeDPT13 = function(buffer) {

  var value = buffer.readInt32BE(0);
  return value;

};

/**
 * decode eis 9 / dpt 14 values
 */
Decoder.prototype.decodeDPT14 = function(buffer) {

  var value = buffer.readFloatBE(0);
  return value;

};

Decoder.prototype.decodeDPT16 = function(buffer) {

  var value = "";
  for(var i = 0; i < buffer.length; i++) {
    value += String.fromCharCode(buffer.readUInt8(i));
  }
  return value;

};

/**
 * decode value
 */
Decoder.prototype.decode = function(len, data, callback) {

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
      value = this.decodeDPT5(data);
    } else {
      err = new Error('Invalid data len for DPT5');
    }
  }

  // eis 5 / dpt 9.xxx
  // assumption
  if(len === 10) {
    type = 'DPT9';
    if(data.length === 2) {
      value = this.decodeDPT9(data);
    }
    else {
      err = new Error('Invalid data len for DPT9');
    }
  }

  if(callback) {
      callback(err, type, value);
  }
};

module.exports = Decoder;
