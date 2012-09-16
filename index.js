
//  Copyright (C) 20212>  Andree Klattenhoff
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

function EIBConnection() {

  this.data = [];
  this.conn = null;

}

/**
 * EIBSocketRemote
 */
EIBConnection.prototype.socketRemote = function(opts, callback) {

  if(!opts.host || !opts.port) {
    console.log('please provide a host and a port as argument!');
    return null;
  }

  this.host = opts.host;
  this.port = opts.port;

  this.conn = net.connect(opts, callback);
  
  this.conn.on('error', this.onError);
  
  this.conn.on('data', this.onData);
  
  this.conn.on('end', this.onEnd);

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
  if(this.conn) this.conn.end();
}

/**
 * discconect handler
 */
EIBConnection.prototype.onEnd = function () {
  console.log('DISCONNECTED');
}

/**
 * for testing stdout data
 */
EIBConnection.prototype.onData = function(data) {

  // TODO find a way to handle responses
  this.data += data;
  var buf = new Buffer(data);
  var arr = new Array();
  for(var i = 0; i < buf.length; i++) {
    arr += buf.readUInt8(i);
  }
  console.log(data.length)
  console.log((data[2]<<8)|(data[3]));
}

EIBConnection.prototype.openTGroup = function(dest, writeOnly, callback) {
  
  // prepare dest
  var arr = new Array(5);
  arr[0] = 0;
  arr[1] = 34;

  arr[2] = (dest>>8) & 0xff;
  arr[3] = dest & 0xff;
  arr[4] = 0xff;

  this.sendRequest(arr, callback);

}

EIBConnection.prototype.sendAPDU = function(data, callback) {

  var arr = new Array(data.length+2);

  arr[0] = 0;
  arr[1] = 37;
  arr[2] = data[0];
  arr[3] = data[1];

  this.conn.sendRequest(arr, callback);

}

EIBConnection.prototype.sendRequest = function(input, callback) {
  
  var data = new Array(input.length+2);

  data[0] = (input.length>>8) &0xff
  data[1] = input.length & 0xff;

  for(i = 2; i < data.length; i++) {
    data[i] = input[i-2];
  }
  
  var buf = pack(data);
  
  this.conn.write(buf, callback);

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

function connect() {
  var e = new EIBConnection();
  return e;
}

module.exports = connect;
