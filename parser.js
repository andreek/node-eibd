//  Copyright (C) 2013  Andree Klattenhoff
//  
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//  
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//  
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
var Readable = require('stream').Readable,
    tools = require('./tools');

/**
 * EIBParser
 */
function EIBParser(socket, options) {

  if(!(this instanceof EIBParser)) 
    return new EIBParser(options);

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

EIBParser.prototype = Object.create(
      Readable.prototype, { constructor: { value: EIBParser }});

/**
 * parse telegram
 */
EIBParser.prototype.parseTelegram = function(telegram) {

  var self = this;
  var len = telegram[1];
  
  if(len < 8) {
    console.error('[ERROR] Invalid buffer length received')
    return;
  }

  // command
  var input = telegram[telegram.length-1];
  var action = input;
  
  
  // 4 + 5 src adr.
  var src = (telegram[4]<<8)|telegram[5];
  // 6 + 7 dest adr.
  var dest = (telegram[6]<<8)|telegram[7];
  var val = null;

  // value is not coded with command 
  // extra field
  if(len === 9){
    action = telegram[telegram.length-1];
    input = input.toString(16);
  }
  
  switch(action&0xC0)  {
    case 0x80:
      action = 'write';
      val = input;

      // decode command from value
      if(len === 8) val = val-128;
      break;
    case 0x40:
      action = 'response';
      val = input;

      // decode command from value
      if(len === 8) val = val-64;
      break;
    case 0x00:
      action = 'read';
      break;
  }
  
  this.emit(action, tools.addr2str(src, false), tools.addr2str(dest, true), val);
};

/**
 * fetch data from socket
 */
EIBParser.prototype._read = function(n) {
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
    
    // emit event
    this.parseTelegram(telegram);

    // housekeeping for next telegram
    this._inPackage = false;
    this._len = null;
    this._telegram = [];
  }

  // hit stream to be readable again
  return this.push('');
};

EIBParser.prototype.str2addr = tools.str2addr;
EIBParser.prototype.addr2str = tools.addr2str;

module.exports = EIBParser;
