'use strict';

var parser = require('./parser');
var tools = require('./tools');
var net = require('net');
var events = require('events');
var util = require('util');

function Connection() {
  var self = this;
  events.EventEmitter.call(self);

  self.data = new Buffer([]);
  self.parser = null;
  self.conn = null;

}
util.inherits(Connection, events.EventEmitter);

/**
 * Opens a connection eibd over TCP/IP or UNIX local socket - establishes the connection to the given host/port or path.
 * Does not verify it is a valid eibd/knxd connection (yet)
 * 
 * @param {Object} opts - either {host:ip, port:port} or {path:unixSocketPath} type object
 * @param {function} callback - Function(err) to be called upon completion
 */
Connection.prototype.socketRemote = function(opts, callback) {

  var self = this;

  if ((!opts.host || !opts.port) && !opts.path) {
    callback(new Error(
        'please provide a host and a port as argument or supply a UNIX socket path!'));
    return;
  }

  self.host = opts.host;
  self.port = opts.port;
  self.path = opts.path;

  self.socket = net.connect(opts, callback);
  self.socket.on('error', callback);
  self.socket.on('error', self.onError);
  self.socket.on('close', function() {
    self.emit('close');
  });

};

/**
 * error handler
 */
Connection.prototype.onError = function(err) {
  var self = this;
  self.end();
};

/**
 * close function - Ends the net.Socket
 * 
 */
Connection.prototype.end = function() {
  var self = this;
  if (self.socket) {
    self.socket.end();
  }

  if (self.parser) {
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

  if (writeOnly !== 0) {
    arr[4] = 0xff;
  } else {
    arr[4] = 0x00;
  }

  self.sendRequest(arr);

  self.parser = new parser(self.socket);

  if (callback) {
    callback(self.parser);
  }

};

/**
 * Opens a connection of type T_Group
 * 
 * @param {integer} dest - Numeric representation of the destination address (16 Bit UINT)
 * @param {Boolean} writeOnly - If true, connection is open for write only
 * @param {function} callback - Function(err) to be called upon completion
 */
Connection.prototype.openTGroup = function(dest, writeOnly, callback) {
  var self = this;

  // prepare dest
  var arr = new Array(5);
  arr[0] = 0;
  arr[1] = 34;
  arr[2] = (dest >> 8) & 0xff;
  arr[3] = dest & 0xff;

  if (writeOnly !== 0) {
    arr[4] = 0xff;
  } else {
    arr[4] = 0x00;
  }

  var buffer = null;

  var handler = function(data) {
    if (buffer) {
      buffer = Buffer.concat([
        buffer,
        data ]);
    } else {
      buffer = data;
    }

    if (buffer.length < 2) {
      return;
    }
    if (buffer[0] << 8 | buffer[1] > buffer.length - 2) {
      return;
    }
    data = buffer;
    self.socket.removeListener('data', handler);

    if (data[0] << 8 | data[1] === 2) {
      if (data[2] << 8 | data[3] === 34) {
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
 * Sends an APDU (Application Program Data Unit)
 * 
 * @param {array} data - The telegram data to be sent
 * @param {function} callback - function(error) to be called upon completion
 * @param {Boolean} doNotCloseConnection - If true, leaves the connection to knxd open for more telegrams
 */
Connection.prototype.sendAPDU = function(data, callback, doNotCloseConnection) {
  var self = this;
  var start = [
    0,
    37 ];
  var arr = start.concat(data);

  if (data.length === 3) {
    arr[4] = data[2];
  }

  self.sendRequest(arr, function() {
    if (!doNotCloseConnection) {
      self.end();
    }

    if (callback) {
      callback();
    }
  });

};

/**
 * Sends TCP/IP request to eib-daemon
 */
Connection.prototype.sendRequest = function(input, callback) {

  var self = this;
  var data = new Array(input.length + 2);

  data[0] = (input.length >> 8) & 0xff;
  data[1] = input.length & 0xff;

  for (var i = 2; i < data.length; i++) {
    data[i] = input[i - 2];
  }

  var buf = tools.pack(data);

  self.socket.write(buf, callback);

};

function init() {
  var e = new Connection();
  return e;
}

module.exports = init;
