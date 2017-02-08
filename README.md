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
 * DPT232

## CLI Usage

View source code of cli tools as examples for usage.

### groupwrite
  
./bin/groupwrite host port x/x/x 0..255

e.g. `./bin/groupwrite localhost 6270 1/2/3 100`

./bin/groupwrite --socket path x/x/x 0..255

e.g. `./bin/groupwrite --socket /run/knx 1/2/3 100`

### groupswrite
  
./bin/groupswrite host port x/x/x 0..1

e.g. `./bin/groupswrite localhost 6270 1/2/4 1`

./bin/groupswrite --socket path x/x/x 0..1

e.g. `./bin/grouspwrite --socket /run/knx 1/2/4 1`

### groupread
(issues a read request telegram to the bus, does not wait for an answer!)

./bin/groupread host port x/x/x

e.g. `./bin/groupread localhost 6270 1/2/4`

./bin/groupread --socket path x/x/x

e.g. `./bin/groupread --socket /run/knx 1/2/4`

### Listening for group telegrams

./bin/groupsocketlisten host port

./bin/groupsocketlisten --socket path

## Related projects
 * https://github.com/knxd/knxd
 * https://github.com/snowdd1/homebridge-knx
 * https://bitbucket.org/ekarak/node-red-contrib-knxjs

## eibd documentation

 * http://www.auto.tuwien.ac.at/~mkoegler/eib/sdkdoc-0.0.5.pdf
