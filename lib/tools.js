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
    var a = (adr>>11)&0x1f; // allow 16bit addresses using 5 bits for the first address part
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
