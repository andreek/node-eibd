
//  Copyright (C) 2012>  Andree Klattenhoff
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
var net = require('net');

/**
 * pack array to u8int-buffer
 */
function pack(data) {
  var buf = new Buffer(data.length);

  for(var i = 0; i < data.length; i++) {
    buf.writeUInt8(data[i], i);
  }

  return buf;
}

/**
 * unpack buffer in reverse order
 */
function unpack(buf) {
  var arr = new Array();
  for(var i = buf.length-1; i >= 0; i--) {
    var val = buf.readUInt8(i);
    arr.push(val);
  }

  return arr;

}

function EIBConnection() {

  this.data = new Buffer([]);
  this.conn = null;

}

/**
 * EIBSocketRemote
 */
EIBConnection.prototype.socketRemote = function(opts, callback) {

  if(!opts.host || !opts.port) {
    callback(new Error('please provide a host and a port as argument!'));
  }

  this.host = opts.host;
  this.port = opts.port;

  this.socket = net.connect(opts, callback);
  
  this.socket.on('error', this.onError);
  
  this.socket.on('data', this.onData);
  
}

/**
 * error handler
 */
EIBConnection.prototype.onError = function(err) {
  console.log('ERROR :\n\n'+err+'\n\nClosing Connection');
  this.end();
}

/**
 * close function
 */
EIBConnection.prototype.end = function() {
  if(this.socket) this.socket.end();
}

/**
 * for testing stdout data
 */
EIBConnection.prototype.onData = function(data) {
  // store data
  this.data = data;
}

EIBConnection.prototype.openGroupSocket = function(writeOnly, callback) {
  
  var arr = new Array(5);
 
  arr[2] = 0;
  arr[3] = 0;
  if(writeOnly != 0) {
    arr[4] = 0xff;
  } else {
    arr[4] = 0x00;
  }

  arr[0] = 0;
  arr[1] = 38;

  var self = this;
  this.socket.on('data', function(data) {
    
    data = unpack(data);

    if(data.length > 4) {
      var src = (data[5]<<8)|data[4];
      var dest = (data[3]<<8)|data[2];
      var action = '';
      var val = 0;
      switch(data[0]&0xC0)  {
        case 0x80:
          action = 'Write';
          val = data[0]-128;
          break;
        case 0x40:
          action = 'Response';
          val = data[0]-64;
          break;
        case 0x00:
          action = 'Read';
          break;
      }
      
      if(action === 'Read') {
        console.log(action+' from '+self.addr2str(src, false)+' to '+self.addr2str(dest, true));
      } else {
        console.log(action+' from '+self.addr2str(src, false)+' to '+self.addr2str(dest, true)+': '+val);
      }

    } else {
      console.log(data);
    }
    
  });

  this.sendRequest(arr, function() {
    callback();
  });
  
}

EIBConnection.prototype.openTGroup = function(dest, writeOnly, callback) {
  
  // prepare dest
  var arr = new Array(5);
  arr[0] = 0;
  arr[1] = 34;

  arr[2] = (dest>>8) & 0xff;
  arr[3] = dest & 0xff;
  if(writeOnly != 0) {
    arr[4] = 0xff;
  } else {
    arr[4] = 0x00;
  }

  this.socket.once('data', function(data) {
    data = unpack(data);
    
    if((data[2]<<8) | data[3] === 2) {
      if(data[0]<<8 | data[1] == 34) {
        callback(null);
      } else {
        callback(new Error('request invalid'));
      }
    } else {
      callback(new Error('invalid buffer length received'))
    }

  });
  this.sendRequest(arr);

}

EIBConnection.prototype.sendAPDU = function(data, callback) {

  var arr = new Array(data.length+2);

  arr[0] = 0;
  arr[1] = 37;
  arr[2] = data[0];
  arr[3] = data[1];

  var self = this;
  this.sendRequest(arr, function() {
    self.end();
    callback();
  });

}

EIBConnection.prototype.sendRequest = function(input, callback) {
  
  var data = new Array(input.length+2);

  data[0] = (input.length>>8) &0xff
  data[1] = input.length & 0xff;

  for(i = 2; i < data.length; i++) {
    data[i] = input[i-2];
  }
  
  var buf = pack(data);
  
  this.socket.write(buf, callback);

}

/**
 * parse string to 16-bit integer knx address
 */
EIBConnection.prototype.str2addr = function(str, callback) {
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
    if(callback) {
      callback(null, result);
    } else {
      return result;
    }
  } else {
    if(callback) { 
      callback(new Error("Could not parse address"));
    } else {
      return result;
    }
  }
}

EIBConnection.prototype.addr2str = function(adr, ga) {
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

function init() {
  var e = new EIBConnection();
  return e;
}

module.exports = init;
