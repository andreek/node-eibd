# nodejs eibd client (EIB/KNX daemon)

This is at the moment not a full implementation of the eibd client library. It supports all functions needed
for groupswrite, groupread, groupsocketlisten.

## Usage

### Change values with groupswrite
  
  ./bin/groupswrite localhost 6720 0/1/0 1

### Read values with groupread
  ./bin/groupread localhost 6720 0/1/0

### Listening for telegrams
  ./bin/groupsocketlisten localhost 6720

## Resources

 * https://github.com/ekarak/eibd_ruby
 * http://sourceforge.net/projects/bcusdk/ (c client library)
