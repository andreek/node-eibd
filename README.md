# eibd [![Build Status](https://secure.travis-ci.org/andreek/node-eibd.png?branch=master)](http://travis-ci.org/andreek/node-eibd)

A Node.js client for eib/knx daemon. Implements all functions of eibd client library needed for groupswrite/groupwrite, groupread and groupsocketlisten.

## Install

npm install eibd

## Test
  
npm test

## Supported Datatypes

 * EIS 1 / DPT 1.xxx
 * EIS 2 / DPT 3.xxx
 * EIS 3 / DPT 10.xxx
 * EIS 4 / DPT 11.xxx
 * EIS 5 / DPT 9.xxx
 * EIS 6 / DPT 5.xxx
 * EIS 8 / DPT 2.xxx
 * EIS 9 / DPT 14.xxx
 * EIS 10.000 / DPT 7.xxx
 * EIS 10.001 / DPT 8.xxx
 * EIS 11 / DPT 12.xxx
 * EIS 11.001 / DPT 3.xxx
 * EIS 13 / DPT 4.xxx
 * EIS 14 / DPT 6.xxx
 * EIS 15 / DPT 16.xxx

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

### Parser.parseValue(len, telegram)

Try to parse values with assumptions about package len.

### Parse.encodeEIS5(buffer)

Parse value to EIS 5 / DPT 9.xxx from buffer

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

  parser.on('write', function(src, dest, dpt, val){
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
