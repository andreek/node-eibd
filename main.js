
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

function unpack(buf) {
  var arr = new Array(buf.length);
  for(var i = 0; i < buf.length; i++) {
    arr[i] = buf.readUInt8(i);
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

  this.socket.on('data', function(data) {
    // TODO Parse data for read / write / reponse requests and values
    /*
    console.log(data[3]);
    console.log(data[3] & 0xC0);
    data = unpack(data)
    console.log(data[3] & 0xC0);
  //  console.log(data[3]&0xC0);
   // var known = (data[0] & 0x3) || (data[3] & 0xC0) == 0xC0;
    //console.log(known);
    //
    switch(data[3]& 0xC0)  {
      case 8:
        console.log('write')  
        break;
      case 4:
        console.log('response');
        break;
      case 0:
        console.log('read')
        break;
    }
//    console.log(data[1]);
//    console.log('WRITE?' + (data[3] & 0xC0));*/
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
  arr[4] = 0xff;

  this.socket.once('data', function(data) {
    data = unpack(data);
    console.log((data[0]<<8) | data[1]);
    this.end();
    callback();
  });
  this.sendRequest(arr);

}

EIBConnection.prototype.sendAPDU = function(data, callback) {

  var arr = new Array(data.length+2);

  arr[0] = 0;
  arr[1] = 37;
  arr[2] = data[0];
  arr[3] = data[1];

  this.socket.once('data', function(data) {
    data = unpack(data);
    console.log(data);
  });

  this.sendRequest(arr, callback);

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

function init() {
  var e = new EIBConnection();
  return e;
}

module.exports = init;
