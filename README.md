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


## Resources

 * https://github.com/ekarak/eibd_ruby
 * http://switch.dl.sourceforge.net/project/bcusdk/sdkdoc/sdkdoc-0.0.5.pdf
