# nodejs eibd client (EIB/KNX daemon)

This is at the moment not a full implementation of the eibd client library. It supports all functions needed
for groupswrite, groupread, groupsocketlisten.

## Installation

  npm install eibd

## Usage

### Change values with groupswrite
  
  ./bin/groupswrite host port gad 0..255

### Read values with groupread
  ./bin/groupread host port gad

### Listening for telegrams
  ./bin/groupsocketlisten host port

## Resources

 * https://github.com/ekarak/eibd_ruby
 * http://sourceforge.net/projects/bcusdk/ (c client library)
