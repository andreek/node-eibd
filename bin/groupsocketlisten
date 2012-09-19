#!/usr/bin/env node

/**
 * groupsocketlisten
 */
function groupsocketlisten(opts, callback) {

  var eibd = require('../main')();

  eibd.socketRemote(opts, function() {
    
    eibd.openGroupSocket(0, callback);

  });

}

var host = process.argv[2];
var port = process.argv[3];

if(!host || !port) {
  callback(new Error('No hostname or port'));
} else {
  groupsocketlisten({ host: host, port: port }, function() {
    console.log('Listening for input:');
  });
}
