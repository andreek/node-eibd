'use strict';

/**
 * pack array to u8int-buffer
 */
module.exports.pack = function(data) {
  var buf = new Buffer(data.length);

  for(var i = 0; i < data.length; i++) {
    buf.writeUInt8(data[i], i);
  }

  return buf;
};

module.exports.str2addr = function(str) {
  var m = str.match(/(\d*)\/(\d*)\/(\d*)/);
  var a, b, c = 0;
  var result = -1;

  if(m && m.length > 0) {
    a = (m[1] & 0x01f) << 11;
    b = (m[2] & 0x07) << 8;
    c = m[3] & 0xff;
    result = a | b | c;
  }

  if(result > -1) {
    return result;
  } else {
    return new Error("Could not parse address");
  }
};

module.exports.addr2str = function(adr, ga) {
  var str = '';
  if(ga === true) {
    var a = (adr>>11)&0xf;
    var b = (adr>>8)&0x7;
    var c = (adr & 0xff);
    str = a+'/'+b+'/'+c;
  } else {
    var a = (adr>>12)&0xf;
    var b = (adr>>8)&0xf;
    var c = adr&0xff;
    str = a+'.'+b+'.'+c;
  }

  return str;
};

/**
 * Convert a base-2 exponential DPT-9 mantissa/exp to float.
 */
module.exports.convertToFloat = function(m, exp) {
    return 0.01 * m * Math.pow(2,exp);
};

/**
 * Convert a float to a DPT-9 matissa/exp.
 */
module.exports.convertFromFloat = function(v) {
    var exp = Math.floor(Math.max(Math.log(Math.abs(v)*100)/Math.log(2)-10,0));
    var m = v * 100 / (1 << exp);
    return [m, exp];
};
