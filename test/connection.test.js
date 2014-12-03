'use strict';

var assert = require('assert'),
    eibd = require('../');

var port = 6721;
var opts = { host: 'localhost', port: port };
var TestServer = new require('./support/server');
var server = null;

describe('EIBConnection', function() {

  beforeEach(function(done) {
    server = new TestServer(port, function() {
      done();
    });
  });

  afterEach(function(done) {
    if(server) {
        server.end(); 
    }
    done();
  });

  describe('socketRemote', function() {
    it('should open a connection', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        assert.equal(true, true);
        done();
      });
    }),
    it('should catch error if server is not reachable', function(done) {
      server.end();
      server = null;
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function(err) {
        assert.equal(err.code, 'ECONNREFUSED');
        done();
      });
    }),
    it('should notice if host or port is not given', function(done) {
      var conn = new eibd.Connection();
      try {
        conn.socketRemote(port);
      } catch(err) {
        assert.equal(true, err instanceof Error);
        done();      
      }
    });
  }),
  describe('openTGroup', function() {
    it('should work without error', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        var dest = eibd.str2addr('0/1/0');
        conn.openTGroup(dest, 0, function(err) {
          assert.equal(null, err);
          done(); 
        });
      });
    });
  }),
  describe('sendAPDU', function() {
    it('should work without error', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        conn.sendAPDU([0,0],function(err) {
          assert.equal(undefined, err);
          done(); 
        });
      });
    });
  }),
  describe('sendAPDU DPT9 4Byte', function() {
    it('should work without error', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        conn.sendAPDU([0,0,0,0],function(err) {
          assert.equal(undefined, err);
          done();
        });
      });
    });
  }),
  describe('sendRequest', function() {
    it('should work without error', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        conn.sendRequest([0,0],function(err) {
          assert.equal(undefined, err);
          done(); 
        });
      });
    }); 
  }),
  describe('openGroupSocket', function() {
    it('should get called', function(done) {
      var conn = new eibd.Connection();
      conn.socketRemote(opts, function() {
        var i = 0;
        conn.openGroupSocket(0, function(parser) {
          parser.on('read', function() {
            i++;
            if(i === 2) {
                done();  
            }
          });
          // send command for socket listen
          var groupswrite = new eibd.Connection();
          groupswrite.socketRemote(opts, function() {
            var dest = eibd.str2addr('0/1/0');
            groupswrite.openTGroup(dest, 1, function() {
              groupswrite.sendAPDU([0, 0xff&1]);
            });
          });
        });
      });

    });
  });
});
