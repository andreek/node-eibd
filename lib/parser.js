'use strict';

var Readable = require('stream').Readable,
    Decoder = require('./decoder'),
    tools = require('./tools');

var isModernBuffer = (
  typeof Buffer.alloc === 'function' &&
  typeof Buffer.allocUnsafe === 'function' &&
  typeof Buffer.from === 'function'
);

/**
 * Parser
 */
function Parser(socket, options) {

  if(!(this instanceof Parser)) {
    return new Parser(options);
  }

  Readable.call(this, options);

  this.decoder = new Decoder();
  this._source = socket;
  this._inputBuffer = new Buffer(0);
  
  var self = this;
  // hit source end
  this._source.on('end', function() {

  });

  // get data
  this._source.on('data', function(data) {
    self.onData(data);
  });

}

Parser.prototype = Object.create(
      Readable.prototype, { constructor: { value: Parser }});

/**
 * parse telegram
 */
Parser.prototype.parseTelegram = function(telegram) {
  var self = this;
  var len = telegram.readUInt8(1);
  
  // 4 + 5 src adr.
  var src = telegram.readUInt16BE(4);
  // 6 + 7 dest adr.
  var dest = telegram.readUInt16BE(6);

  // action
  var action = telegram.readUInt8(9);
  var event = '';
  switch(action)  {
    case 129:
      event = 'write';
      break;
    case 128:
      event = 'write';
      break;
    case 65:
      event = 'response';
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
    var valbuffer;
    if (len<=8) {
      val = telegram[telegram.length-1];
      valbuffer = isModernBuffer ? Buffer.from([val]) : new Buffer([val]);  
    } else { //if(len > 8) 
      val = telegram.slice(10, telegram.length);
      valbuffer = isModernBuffer ? Buffer.from(val) : new Buffer(val);  
    }
    
    // emit raw telegram event, pass the addresses and the buffer, no DPT guessing, copy of data buffer
    self.emit('telegram', event, tools.addr2str(src, false), tools.addr2str(dest, true), valbuffer);
    
    self.decoder.decode(len, val, function(err, type, value) {

      // emit action event
      self.emit(event, tools.addr2str(src, false), tools.addr2str(dest, true), type, value);

      // emit dest address event
      self.emit(tools.addr2str(dest, true), event, tools.addr2str(src, false), tools.addr2str(dest, true), type, value);

    });


  } else {

    // emit action event
    self.emit(event, tools.addr2str(src, false), tools.addr2str(dest, true));

    // emit dest address event
    self.emit(tools.addr2str(dest, true), event, tools.addr2str(src, false), tools.addr2str(dest, true));  

  }
  
};

/**
 * data received from socket
 */
Parser.prototype.onData = function(chunk) {

  // no data received
  if(chunk === null) {
    return ;
  }
    
  // store chunk
  this._inputBuffer = Buffer.concat([this._inputBuffer, chunk]);
    
  while (true) {
    // check if at least length header is here
    if (this._inputBuffer.length < 2) {
      return;
    }

    var packetlen = this._inputBuffer[1] + 2;
    if (packetlen > this._inputBuffer.length) {
      //not enough data
      return;
    }

    //what kind of packet have we got...
    if (packetlen === 4) {
      //confirm mag
    } else if (packetlen === 5) {
      //opengroupsocket
    } else if (packetlen >= 6) {
      // we have at least one complete package
      var telegram = new Buffer(this._inputBuffer.slice(0, packetlen));
      // emit event
      this.parseTelegram(telegram);
    }
    this._inputBuffer = new Buffer(this._inputBuffer.slice(packetlen));
  }
};

module.exports = Parser;
