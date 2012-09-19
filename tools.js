/**
 * pack array to u8int-buffer
 */
module.exports.pack = function(data) {
  var buf = new Buffer(data.length);

  for(var i = 0; i < data.length; i++) {
    buf.writeUInt8(data[i], i);
  }

  return buf;
}

/**
 * unpack uint8-buffer in reverse order
 */
module.exports.unpack = function(buf) {
  var arr = new Array();
  for(var i = buf.length-1; i >= 0; i--) {
    var val = buf.readUInt8(i);
    arr.push(val);
  }

  return arr;
}

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
}

module.exports.addr2str = function(adr, ga) {
  var str = '';
  if(ga === true) {
    var a = (adr>>11)&0xf;
    var b = (adr>>8)&0x7;
    var c = (adr & 0xff);
    str = a+'/'+b+'/'+c;
  } else {
    var a = adr>>12;
    var b = (adr>>8)&0xf;
    var c = a&0xff;
    str = a+'.'+b+'.'+c;
  }

  return str;
} 
