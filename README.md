# node.js eibd client (EIB/KNX daemon)

Implements all functions of eibd client library needed for groupswrite/groupwrite, groupread and groupsocketlisten.

## Install

npm install eibd

## Test
  
npm test

## Usage

### groupwrite
  
./bin/groupwrite host port x/x/x 0..255

### groupswrite
  
./bin/groupswrite host port x/x/x 0..1

### groupread

./bin/groupread host port x/x/x

### Listening for group telegrams

./bin/groupsocketlisten host port

## API

### socketRemote(opts, callback)

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

### openGroupSocket(writeOnly, callback)

Opens a Group communication interface

```javascript
eibd.on('data', function(action, src, dest, val) {
  // do something
});

eibd.openGroupSocket(0);
```

### openTGroup(dest, writeOnly, callback)

Opens a connection of type T_Group

```javascript
var dest = eibd.str2addr('x/x/x');
eibd.openTGroup(dest, 1, function(err) {

});
```

### sendAPDU(data, callback)

Sends an APDU

### sendRequest(data, callback)

Sends TCP/IP request to eib-daemon

### str2addr(str);

Encodes string to knx address

### addr2str(adr, gad=true/false);

Decodes knx address to string

## eibd documentation

 * http://switch.dl.sourceforge.net/project/bcusdk/sdkdoc/sdkdoc-0.0.5.pdf
