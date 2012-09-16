var eibd = require('./index')();

function switchValue() {
 
  var address = eibd.str2addr('0/1/0');

  eibd.openTGroup(address, function () {

    var value = new Array(2);
    value[0] = 0;
    // 0 will be written to device
    value[1] = 0x80 | 0;

    eibd.sendAPDU(value, function() {
      // whatever
    });
  
  });

}

eibd.socketRemote({ host: 'localhost', port: '6720'}, switchValue);
