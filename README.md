# node.js eibd client (EIB/KNX daemon)

Implements all functions of eibd client library needed for groupswrite/groupwrite, groupread and groupsocketlisten.

## Install

  npm install eibd

## Test
  
  npm test

## Usage

### Change values with groupswrite
  
  ./bin/groupswrite host port gad 0..255

### Read values with groupread
  ./bin/groupread host port gad

### Listening for telegrams
  ./bin/groupsocketlisten host port


## Resources

 * https://github.com/ekarak/eibd_ruby
 * http://switch.dl.sourceforge.net/project/bcusdk/sdkdoc/sdkdoc-0.0.5.pdf
