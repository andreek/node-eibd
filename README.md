# eibd

A Node.js client for eib/knx daemon. Implements all functions of eibd client library needed for groupswrite/groupwrite, groupread and groupsocketlisten.

## Install

npm install eibd

## Test
  
npm test

## CLI Usage

### groupwrite
  
./bin/groupwrite host port x/x/x 0..255

### groupswrite
  
./bin/groupswrite host port x/x/x 0..1

### groupread

./bin/groupread host port x/x/x

### Listening for group telegrams

./bin/groupsocketlisten host port

## API

### Connection.socketRemote(opts, callback)

Opens a connection eibd over TCP/IP. 

```javascript
var opts = {
  host: 'localhost',
  port: 6720
};

eibd.socketRemote(opts, function() {
  // connected
});
```

### Connection.openGroupSocket(writeOnly, callback)

Opens a Group communication interface

```javascript
eibd.on('data', function(action, src, dest, val) {
  // do something
});

eibd.openGroupSocket(0);
```

### Connection.openTGroup(dest, writeOnly, callback)

Opens a connection of type T_Group

```javascript
var dest = eibd.str2addr('x/x/x');
eibd.openTGroup(dest, 1, function(err) {

});
```

### Connection.sendAPDU(data, callback)

Sends an APDU

### Connection.sendRequest(data, callback)

Sends TCP/IP request to eib-daemon

### Parser.parseTelegram(telegram)

Parse telegram and emits 'write', 'response' or 'read' events.


### str2addr(str);

Encodes string to knx address

### addr2str(adr, gad=true/false);

Decodes knx address to string

## Example
```javascript
var eibd = require('eibd');
/**
 * groupsocketlisten
 */
function groupsocketlisten(opts, callback) {

  var conn = eibd.Connection();

  conn.socketRemote(opts, function() {
    
    conn.openGroupSocket(0, callback);

  });

}

var host = 'localhost';
var port = 6720;

groupsocketlisten({ host: host, port: port }, function(parser) {

  parser.on('write', function(src, dest, val){
    console.log('Write from '+src+' to '+dest+': '+val);
  });

  parser.on('response', function(src, dest, val) {
    console.log('Response from '+src+' to '+dest+': '+val);
  });
  
  parser.on('read', function(src, dest) {
    console.log('Read from '+src+' to '+dest);
  });

});
```

## eibd documentation

 * http://switch.dl.sourceforge.net/project/bcusdk/sdkdoc/sdkdoc-0.0.5.pdf
