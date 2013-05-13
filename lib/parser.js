var Readable = require('stream').Readable,
    tools = require('./tools');

/**
 * Parser
 */
function Parser(socket, options) {

  if(!(this instanceof Parser)) 
    return new Parser(options);

  Readable.call(this, options);

  this._source = socket;
  this._inPackage = false;
  this._len = null;
  this._telegram = [];
  
  var self = this;
  // hit source end
  this._source.on('end', function() {
    self.push(null);
  });

  // hit source readable
  this._source.on('readable', function() {
    self.read(0);
  });

}

Parser.prototype = Object.create(
      Readable.prototype, { constructor: { value: Parser }});

/**
 * encode eis 5 / dpt 9 values
 */
Parser.prototype.encodeEIS5 = function(buffer) {
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
 * parse value
 */
Parser.prototype.parseValue = function(len, data, callback) {

  // eis 1 / dpt 1.xxx
  if(len === 8) {
    data = data-64;
    if(data > 1) {
      data = data-64;
    }
  }

  // eis 6 / dpt 5.xxx
  if(len === 9){
    data = data.readUInt8(0);
  }

  // eis 5 / dpt 9.xxx
  if(len === 10) {
    data = this.encodeEIS5(data);
  }

  return data;
};
/**
 * parse telegram
 */
Parser.prototype.parseTelegram = function(telegram) {

  var len = telegram.readUInt8(1);
  
  // 4 + 5 src adr.
  var src = telegram.readUInt16BE(4);
  // 6 + 7 dest adr.
  var dest = telegram.readUInt16BE(6);

  // action
  var action = telegram.readUInt8(9);
  var event = '';
  switch(action)  {
    case 128:
      event = 'write';
      break;
    case 64:
      event = 'response';
      break;
    case 0:
      event = 'read';
      break;
  }
  
  if(action > 0) {
    
    // value
    var val = null;

    val = telegram[telegram.length-1];
    if(len > 8) {
      val = telegram.slice(10, telegram.length);
    }

    val = this.parseValue(len, val);

    this.emit(event, tools.addr2str(src, false), tools.addr2str(dest, true), val);

  } else {

    this.emit(event, tools.addr2str(src, false), tools.addr2str(dest, true));

  }
  
};

/**
 * fetch data from socket
 */
Parser.prototype._read = function(n) {
  var chunk = this._source.read();

  // no data received
  if(chunk === null)
    return this.push('');
  
  // telegram len received
  if(!this._inPackage && chunk.length >= 2) {
    this._len = chunk[1];
    this._inPackage = true;
  }

  // store chunk
  this._telegram.push(chunk);

  // make buffer to one telegram
  var data = Buffer.concat(this._telegram);
  var telegram = data.slice(0, this._len+2);
  // check telegram is complety received
  if(this._len+2 === telegram.length ) {
    this._telegram = this._telegram.slice(0, this._len+2);
    
    if(this._len > 2) {
      // emit event
      this.parseTelegram(telegram);
    }

    // housekeeping for next telegram
    this._inPackage = false;
    this._len = null;
    this._telegram = [];
  }

  // hit stream to be readable again
  return this.push('');
};

module.exports = Parser;
