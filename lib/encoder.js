module.exports = Encoder;
/**
 * Implements encode methods for dpt types
 */
function Encoder() {
}

/**
 * encode dpt 1 values
 */
Encoder.prototype.encodeDPT1 = function(on) {
  var buffer = new Buffer(1);
  var value = on ? 1 : 0;
  buffer.writeUInt8(value, 0);
  return buffer;
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


function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
/**
 * encode DTP-10 values.
 *
 * TIME: 10.001 (PDT_TIME).
 *
 * For time:
 * 3 bits for day of week (0 = none; 1 = Monday ; ...; 7 = Sunday)
 * 5 bits for hour (00-23)
 * ---- byte 1
 * 2 bits ZERO as padding
 * 6 bits for minutes (00-59)
 * ---- byte 2
 * 2 bits ZERO as padding
 * 6 bits for seconds (00-59)
 * ---- byte 3
 * 3 octets: N3U5 - r2U6 - r2U6
 */
Encoder.prototype.encodeDPT10 = function(dayOfTheWeek, hour, minutes, seconds) {
  var data = [0,0,0];

  // First byte
  data[0] |= dayOfTheWeek << 5;  // convert the day (mask 3 bits) and shift to left fot 5 bits
  data[0] |= hour & 0x1F; // convert the hour (mask 5 bits)

  // Second byte
  data[1] |= minutes & 0xFF; // convert the hour (mask 6 bits)

  // Third byte
  data[2] |= seconds & 0xFF; // convert the hour (mask 6 bits)

  var buffer = new Buffer(3);
  buffer.writeUInt8(data[0], 0);
  buffer.writeUInt8(data[1], 1);
  buffer.writeUInt8(data[2], 2);
  return buffer;
};

/**
 * encode DTP-11 values:
 *
 * 000 + Day [1..31]
 * 0000 + Month [1..12]
 * 0 + Year  [0..99]
 * For Dates:
 */
Encoder.prototype.encodeDPT11 = function(day, month, year) {
    var data = [0,0,0];

    // First byte
    data[0] |= day;  // convert the day

    // Second byte
    data[1] |= month;

    // Third byte
    data[2] |= year; // convert the hour (mask 6 bits)

    var buffer = new Buffer(3);
    buffer.writeUInt8(data[0], 0);
    buffer.writeUInt8(data[1], 1);
    buffer.writeUInt8(data[2], 2);
    return buffer;
};
