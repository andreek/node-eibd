#!/usr/bin/env node
var eibd = require('../main');

/**
 * groupswrite
 */
function groupswrite(opts, gad, value, callback) {
  
  var conn = eibd();

  var address = conn.str2addr(gad);

  conn.socketRemote(opts, function() {
    conn.openTGroup(address, 0, function (err) {

      if(err) {
        callback(err);
      } else {
        var data = new Array(2);
        data[0] = 0;
        data[1] = 0x80 | value;

        // callback fired after server responses!
        conn.sendAPDU(data, callback);
      }

    });
  });
}

var host = process.argv[2];
var port = process.argv[3];
var gad = process.argv[4];
var value = process.argv[5];

if(!host || !port) {
  console.log(new Error('No hostname or port'));
} else if(!gad) {
  console.log(new Error('No gad given'));
} else if(!value) {
  console.log(new Error('No value given'));
} else {
  groupswrite({ host: host, port: port}, gad, value, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('value written');
    }
  });
}
