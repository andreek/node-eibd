'use strict';

var Encoder = require('./encoder');

function createMessage(messageAction, DPTType, value) {
  DPTType = DPTType || '';
  var read = 0;
  var response = 64;
  var write = 128;

  var firstByte = read;
  if (messageAction === 'response') {
    firstByte = response;
  } else if (messageAction === 'write') {
    firstByte = write;
  }

  var data = new Buffer(2);
  data.writeUInt8(0, 0);
  var payload = new Encoder().encode(DPTType, value);

  var dottedDPTType = DPTType + '.';
  if(messageAction === 'read') {
     //Read message no payload needed
     data.writeUInt8(0, 1);
 } else if(dottedDPTType.indexOf('DPT1.') === 0
        || dottedDPTType.indexOf('DPT2.') === 0
        || dottedDPTType.indexOf('DPT3.') === 0) {
     //Small payload to or with action
     data.writeUInt8(firstByte | payload.readUInt8(0) , 1);
   } else {
     //Big payload to append
     data.writeUInt8(firstByte,1);
     data = Buffer.concat([data, payload]);
   }

  return Array.prototype.slice.call(data, 0);
}

module.exports = createMessage;
