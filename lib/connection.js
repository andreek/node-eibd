'use strict';

var parser = require('./parser'),
    tools = require('./tools'),
    net = require('net'),
    events = require('events'),
    sys = require('sys');

function Connection() {
  var self = this;
  events.EventEmitter.call(self);

  self.data = new Buffer([]);
  self.parser = null;
  self.conn = null;

}
sys.inherits(Connection, events.EventEmitter);

/**
 * Opens a connection eibd over TCP/IP
 */
Connection.prototype.socketRemote = function(opts, callback) {

  var self = this;

  if(!opts.host || !opts.port) {
    callback(new Error('please provide a host and a port as argument!'));
    return;
  }

  self.host = opts.host;
  self.port = opts.port;

  self.socket = net.connect(opts, callback);
  self.socket.on('error', callback);
  self.socket.on('error', self.onError);
};

/**
 * error handler
 */
Connection.prototype.onError = function(err) {
  var self = this;
  console.error('[ERROR] :\n\n'+err+'\n\nClosing Connection');
  self.end();
};

/**
 * close function
 */
Connection.prototype.end = function() {
  var self = this;
  if(self.socket) {
    self.socket.end();
  }

  if(self.parser) {
    self.parser = null;
  }
};

/**
 * Opens a Group communication interface
 */
Connection.prototype.openGroupSocket = function(writeOnly, callback) {

  var self = this;

  var arr = new Array(5);
  arr[0] = 0;
  arr[1] = 38;
  arr[2] = 0;
  arr[3] = 0;

  if(writeOnly !== 0) {
    arr[4] = 0xff;
  } else {
    arr[4] = 0x00;
  }

  self.sendRequest(arr);

  self.parser = new parser(self.socket);
  
  if(callback) {
      callback(self.parser);
  }


};

/**
 * Opens a connection of type T_Group
 */
Connection.prototype.openTGroup = function(dest, writeOnly, callback) {
  var self = this;

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

  var buffer = null;

  var handler = function(data) {
    if(buffer) {
      buffer = Buffer.concat([buffer, data]);
    } else {
      buffer = data;
    }

    if(buffer.length < 2) {
      return;
    }
    if(buffer[0] << 8 | buffer[1] > buffer.length - 2) {
      return;
    }
    data = buffer;
    self.socket.removeListener('data', handler);

    if(data[0] << 8 | data[1] === 2) {
      if(data[2]<<8 | data[3] == 34) {
        callback(null);
      } else {
        callback(new Error('request invalid'));
      }
    } else {
      callback(new Error('invalid buffer length received'));
    }

  };

  self.socket.on('data', handler);

  self.sendRequest(arr);

};

/**
 * Sends an APDU
 */
Connection.prototype.sendAPDU = function(data, callback) {
  var self = this;
  var start = [0,37];
  var arr = start.concat(data);

  if(data.length === 3) {
    arr[4] = data[2];
  }


  self.sendRequest(arr, function() {
    self.end();
    if(callback) {
        callback();
    }
  });

};

/**
 * Sends TCP/IP request to eib-daemon
 */
Connection.prototype.sendRequest = function(input, callback) {

  var self = this;
  var data = new Array(input.length+2);

  data[0] = (input.length>>8) &0xff;
  data[1] = input.length & 0xff;

  for(var i = 2; i < data.length; i++) {
    data[i] = input[i-2];
  }

  var buf = tools.pack(data);

  self.socket.write(buf, callback);

};

function init() {
  var e = new Connection();
  return e;
}

module.exports = init;
