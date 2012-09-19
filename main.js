
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
var events = require('events'),
    net = require('net'),
    tools = require('./tools'),
    sys = require('sys');

function EIBConnection() {

  events.EventEmitter.call(this);

  this.data = new Buffer([]);
  this.conn = null;

}
sys.inherits(EIBConnection, events.EventEmitter);

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

  this.on('data', callback)

  this.socket.on('data', function(data) {

    data = tools.unpack(data);
    
    var len = data[data.length-2];
    var input = data[0];
    var action = null;
    var src = null;
    var dest = null;
    var val = null;

    if(len === 8) {
      src = (data[5]<<8)|data[4];
      dest = (data[3]<<8)|data[2];
      action = input;
    } else if(len === 9){
      src = (data[6]<<8)|data[5];
      dest = (data[4]<<8)|data[3];
      action = data[1];
      input = input.toString(16);
    }
    
    switch(action&0xC0)  {
      case 0x80:
        action = 'Write';
        val = input;
        if(len === 8) val = val-128;
        break;
      case 0x40:
        action = 'Response';
        val = input;
        if(len === 8) val = val-64;
        break;
      case 0x00:
        action = 'Read';
        break;
    }

    self.emit('data', action, src, dest, val);
    
  });

  this.sendRequest(arr);

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
    data = tools.unpack(data);
    
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
    if(callback) callback();
  });

}

EIBConnection.prototype.sendRequest = function(input, callback) {
  
  var data = new Array(input.length+2);

  data[0] = (input.length>>8) &0xff
  data[1] = input.length & 0xff;

  for(i = 2; i < data.length; i++) {
    data[i] = input[i-2];
  }
  
  var buf = tools.pack(data);
  
  this.socket.write(buf, callback);

}

EIBConnection.prototype.str2addr = tools.str2addr;
EIBConnection.prototype.addr2str = tools.addr2str;

function init() {
  var e = new EIBConnection();
  return e;
}

module.exports = init;
