var assert = require('assert'),
    createMessage = require('../lib/creator.js');


describe('Creator', function() {

  it('should create DPT1 messages', function(done) {
    assert.deepEqual(createMessage('write','DPT1',true), [0, 129]);
    assert.deepEqual(createMessage('write','DPT1',false), [0, 128]);
    
    assert.deepEqual(createMessage('write','DPT1',1), [0, 129]);
    assert.deepEqual(createMessage('write','DPT1',0), [0, 128]);
    
    assert.deepEqual(createMessage('read','DPT1', true), [0, 0]);
    assert.deepEqual(createMessage('read','DPT1'), [0, 0]);
    assert.deepEqual(createMessage('read'), [0, 0]);
    
    assert.deepEqual(createMessage('response','DPT1',true), [0, 65]);
    assert.deepEqual(createMessage('response','DPT1',false), [0, 64]);
    
    done();
  })
  
  it('should create DPT5 messages', function(done) {
    assert.deepEqual(createMessage('write','DPT5',5), [0, 128, 5]);
    assert.deepEqual(createMessage('read','DPT5'), [0, 0]);
    assert.deepEqual(createMessage('response','DPT5',4), [0, 64, 4]);
    done();
  })
  
  it('should create DPT9 messages', function(done) {
    assert.deepEqual(createMessage('write','DPT9',-5.08), [0, 128, 0x97, 0x81]);
    assert.deepEqual(createMessage('read','DPT9'), [0, 0]);
    assert.deepEqual(createMessage('response','DPT9',-5.08), [0, 64, 0x97, 0x81]);
    done();
  })
  
})