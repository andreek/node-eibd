var assert = require('assert'),
    eibd = require('../main');

var port = 6721
var opts = { host: 'localhost', port: port }
var TestServer = new require('./support/server');
var server = null;

describe('EIBConnection', function() {

  beforeEach(function(done) {
    server = new TestServer(port, function() {
      done();
    });
  });

  afterEach(function(done) {
    server.end(); 
    done();
  });

  describe('socketRemote', function() {

    it('should open a connection', function(done) {
      var conn = new eibd();
      conn.socketRemote(opts, function() {
        assert.equal(true, true);
        done();
      });
    }),
    it('should catch error if server is not reachable', function(done) {
      server.end();
      var conn = new eibd();
      conn.socketRemote(opts, function(err) {
        assert.equal(err.code, 'ECONNREFUSED');
        server = new TestServer(port);
        done();
      });
    }),
    it('should notice if host or port is not given', function(done) {
      var conn = new eibd();
      conn.socketRemote(port, function(err) {
        assert.equal(true, true);
        done();
      });
    });
  })
});
