/**
 * simple test server
 */
var net = require('net'),
    tools = require('../../tools');

function TestServer(port, callback) {

  this.groupSockets = [];

  var self = this;
  this.server  = net.createServer(function(socket) {
    socket.on('data', function(data) { 
      self.onData(socket, data);
    });      
  });

  this.server.listen(port, callback);
}

TestServer.prototype.noticeSockets = function(req, dest, src, action, value) {
  var buf = new Array(10);
  if(value) buf = new Array(11);

  buf[0] = 0;
  buf[1] = 8;
  buf[2] = 0;
  buf[3] = req;
  buf[4] = (dest>>8)&0xff;
  buf[5] = dest&0xff;
  buf[6] = (src>>8)&0xff;
  buf[7] = src&0xff;
  buf[8] = 0;
  buf[9] = action&0xff;
  
  if(value) {
    buf[1] = 9;
    buf[10] = value;
  }

  buf = tools.pack(buf);
  for(var i in this.groupSockets) {
    var socket = this.groupSockets[i];
    socket.write(buf);
  }
}

TestServer.prototype.onData = function(socket, buf) {

  var arr = new Array();
  for(var i = 0;  i < buf.length; i++) {
    var val = buf.readUInt8(i);
    arr.push(val);
  }
    
  var len = arr[1];

  if(len >= 4 && arr[2] === 0) {
    
    var req = arr[3];
    var action = arr[5];
      
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
        var dest = (arr[4]<<8)|arr[5];
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

}

module.exports = TestServer;
