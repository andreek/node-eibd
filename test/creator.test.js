'use strict';

var assert = require('assert'),
    createMessage = require('../lib/creator.js');


describe('Creator', function() {

  it('should create DPT1 messages', function() {
    assert.deepEqual(createMessage('write','DPT1',true), [0, 129]);
    assert.deepEqual(createMessage('write','DPT1',false), [0, 128]);

    assert.deepEqual(createMessage('write','DPT1',1), [0, 129]);
    assert.deepEqual(createMessage('write','DPT1',0), [0, 128]);

    assert.deepEqual(createMessage('read','DPT1', true), [0, 0]);
    assert.deepEqual(createMessage('read','DPT1'), [0, 0]);
    assert.deepEqual(createMessage('read'), [0, 0]);

    assert.deepEqual(createMessage('response','DPT1',true), [0, 65]);
    assert.deepEqual(createMessage('response','DPT1',false), [0, 64]);
  });

   it('should create DPT2 messages', function() {
    assert.deepEqual(createMessage('write','DPT2',1), [0, 129]);
    assert.deepEqual(createMessage('write','DPT2',3), [0, 131]);

    assert.deepEqual(createMessage('read','DPT2', true), [0, 0]);
    assert.deepEqual(createMessage('read','DPT2'), [0, 0]);
    assert.deepEqual(createMessage('read'), [0, 0]);

    assert.deepEqual(createMessage('response','DPT2',1), [0, 65]);
    assert.deepEqual(createMessage('response','DPT2',3), [0, 67]);
  });

    it('should create DPT3 messages', function() {
    assert.deepEqual(createMessage('write','DPT3',1), [0, 129]);
    assert.deepEqual(createMessage('write','DPT3',15), [0, 143]);

    assert.deepEqual(createMessage('read','DPT3', true), [0, 0]);
    assert.deepEqual(createMessage('read','DPT3'), [0, 0]);
    assert.deepEqual(createMessage('read'), [0, 0]);

    assert.deepEqual(createMessage('response','DPT3',1), [0, 65]);
    assert.deepEqual(createMessage('response','DPT3',15), [0, 79]);
  });

  it('should create DPT5 messages', function() {
    assert.deepEqual(createMessage('write','DPT5',5), [0, 128, 5]);
    assert.deepEqual(createMessage('read','DPT5'), [0, 0]);
    assert.deepEqual(createMessage('response','DPT5',4), [0, 64, 4]);
  });

  it('should create DPT9 messages', function() {
    assert.deepEqual(createMessage('write','DPT9',-5.08), [0, 128, 0x86, 0x4]);
    assert.deepEqual(createMessage('read','DPT9'), [0, 0]);
    assert.deepEqual(createMessage('response','DPT9',-5.08), [0, 64, 0x86, 0x4]);
  });

});
