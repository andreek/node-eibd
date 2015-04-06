'use strict';
/**
 * simple test server
 */
var net = require('net');

function TestServer(port, callback) {

  this.groupSockets = [];

  var self = this;
  this.server  = net.createServer(function(socket) {
    socket.on('data', function(data) { 
      self.onData(socket, data);
    });      
  });

  this.server.listen(port, callback);
  
  return this;
}

TestServer.prototype.end = function(callback) {

  if(this.server) {
    this.server.close(function() {
      if(callback) {
          callback();
      }
    });
  } else {
    if(callback) {
        callback();
    }
  }
};

TestServer.prototype.noticeSockets = function() {
  var buf = new Buffer([0,8,0,27,0,0,2,1,0,0,0,8,0,27,0,0,0,1,0,0,0,9,0,27,11,8,11,4,0,40,0]);
  for(var i in this.groupSockets) {
    var socket = this.groupSockets[i];
    socket.write(buf);
  }
};

TestServer.prototype.onData = function(socket, buf) {

  var arr = [];
  for(var i = 0;  i < buf.length; i++) {
    var val = buf.readUInt8(i);
    arr.push(val);
  }
    
  var len = arr[1];

  if(len >= 4 && arr[2] === 0) {
    
    var req = arr[3];
    var action = arr[5];
    var dest = (arr[4]<<8)|arr[5];
    
    switch(req) {
      case 38:
        this.groupSockets.push(socket);
        var self = this;
        socket.on('end', function() {
          var idx = self.groupSockets.indexOf(socket);
          self.groupSockets.splice(idx, 1);
        });
        break;
      case 37:
        if(len === 4) {
          this.noticeSockets(req, dest, dest, action);
        } else if(len === 5) {
          this.noticeSockets(req, dest, dest, action, arr[6]);
        }
        break;
      case 34:
        
        var data = [0, 2, 0, 34];
        var buf = new Buffer(data);
        var self = this;
        socket.write(buf, function() {
          self.noticeSockets(req, dest, dest, 64, 255);
        });
        break;
      default:
        break;
    }

  }

};

module.exports = TestServer;
