var Encoder = require('./encoder');

function createMessage(messageAction, DPTType, value) {
  if(!DPTType) {
    DPTType = '';
  }
  var DPT1 = (DPTType.indexOf('DPT1') == 0);
  var data = new Buffer(2);
  data.writeUInt8(0, 0);
  if (messageAction == 'write') {
	if(DPT1 && value) {
	  data.writeUInt8(129, 1);
	} else {
	  data.writeUInt8(128, 1);
	}
  }else if (messageAction == 'response') {
	if(DPT1 && value) {
	  data.writeUInt8(65, 1);
	} else {
	  data.writeUInt8(64, 1);
	}
  } else if (messageAction == 'read') {
    data.writeUInt8(0, 1);
  }
  if(value && !DPT1 && messageAction != 'read') {
    var payload = new Encoder().encode(DPTType, value);
    data = Buffer.concat([data, payload]);
  }
  return Array.prototype.slice.call(data, 0);
}

module.exports = createMessage;

