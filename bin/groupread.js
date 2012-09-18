#!/usr/bin/env node

/**
 * groupread
 */
function groupread(opts, gad, callback) {
 
  var eibd = require('../main')();


  eibd.socketRemote(opts, function() {
    
    var address = eibd.str2addr(gad);
    
    eibd.openTGroup(address, false, function () {

      var value = new Array(2);
      value[0] = 0;
      value[1] = 0;

      eibd.sendAPDU(value, callback);
  
    });

  });

}

var host = process.argv[2];
var port = process.argv[3];
var gad = process.argv[4];

if(!host || !port) {
  callback(new Error('No hostname or port'));
} else if(!gad) {
  callback(new Error('No gad given'));
} else {
  groupread({ host: host, port: port }, gad, function() {
    console.log('Value read from device\nSee groupsocketlisten stream for input');
  });
}
