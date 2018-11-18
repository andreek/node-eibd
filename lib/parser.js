'use strict';

var Readable = require('stream').Readable,
    Decoder = require('./decoder'),
    tools = require('./tools');

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
  this._inputBuffer = Buffer.alloc(0);
  
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
  var action = (telegram.readUInt8(8) & (3))*8+((telegram.readUInt8(9) & (192)) >> 6); //bytes 8 lowest 2 bits and byte 9 highest two bits are action (AND VALUE if VALUE HAS LESS THEN 7 bits !!!!)
  var event = '';
  switch (action) {
    case 10:
      event = 'memory write';
      break;
    case 2:
      event = 'write';
      break;
    case 1:
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
      val = telegram[telegram.length-1] & 63; // only 6 bits for data in the mixed action/data byte
      valbuffer = Buffer.from([val]);  
    } else { //if(len > 8) 
      val = telegram.slice(10, telegram.length);
      valbuffer = Buffer.from(val);  
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
      var telegram = this._inputBuffer.slice(0, packetlen);
      // emit event
      this.parseTelegram(telegram);
    }
    this._inputBuffer = this._inputBuffer.slice(packetlen);
  }
};

module.exports = Parser;
