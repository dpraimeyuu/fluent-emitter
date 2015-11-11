var expect = require('expect.js');
var fluentEmitter = require('../fluent-emitter-factory.js');
var fluentEmitterInstanceOne, fluentEmitterInstanceTwo;

beforeEach(function () {
  fluentEmitterInstanceOne = fluentEmitter(['eventOne', 'eventTwo']);
  fluentEmitterInstanceTwo = fluentEmitter(['eventAlpha', 'eventBeta']);
});

describe('fluent emitter', function () {
  it('should be an object', function () {
    expect(fluentEmitterInstanceOne).to.be.a('object');
  });

  it('should have "on" property', function () {
    expect(fluentEmitterInstanceOne).to.property('on');
  });

  it('should have "emit" property', function () {
    expect(fluentEmitterInstanceOne).to.property('emit');
  });

  it('should have "clearListeners" property', function () {
    expect(fluentEmitterInstanceOne).to.property('clearListeners');
  });
  
  it('should throw exception when trying to listen on undefined event', function(){
    function listenOnNonExistingEvent() {
      fluentEmitterInstanceOne.on.nonExistingEvent();
    }
    
    expect(listenOnNonExistingEvent).to.throwException(function(){});
  });
  
  it('should throw exception when trying to emit undefined event', function(){
    function emitNonExistingEvent() {
      fluentEmitterInstanceOne.emit.nonExistingEvent();
    }
    
    expect(emitNonExistingEvent).to.throwException(function(){});
  });
  
  it('should throw exception when trying to clear listeners for undefined event', function(){
    function clearListenersForNonExistingEvent() {
      fluentEmitterInstanceOne.clearListeners.nonExistingEvent();
    }
    
    expect(clearListenersForNonExistingEvent).to.throwException(function(){});
  });
  
  it('should clear all callbacks', function(){
    let counter = 0;
    
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    
    fluentEmitterInstanceOne.on.eventTwo(() => counter++);
    fluentEmitterInstanceOne.on.eventTwo(() => counter++);
    
    fluentEmitterInstanceOne.clearListeners();
    fluentEmitterInstanceOne.emit.eventOne();
    fluentEmitterInstanceOne.emit.eventTwo();
    
    expect(counter).to.be(0);
  });
  
  it('should clear callbacks for specified event', function(){
    let counter = 0;
    
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    
    fluentEmitterInstanceOne.on.eventTwo(() => counter++);
    fluentEmitterInstanceOne.on.eventTwo(() => counter++);    
    
    fluentEmitterInstanceOne.clearListeners.for.eventTwo();
    fluentEmitterInstanceOne.emit.eventOne();
    fluentEmitterInstanceOne.emit.eventTwo();
    
    expect(counter).to.be(2);
  });
  
  it('should do async listeners processing', function(done){
    let counterAsync = 0;
    fluentEmitterInstanceOne.on.eventOne(({eventArgs, asyncDone}) => {
      setTimeout(function(){
        counterAsync++;
        asyncDone();
      }, 300);
    });
    
    fluentEmitterInstanceOne.on.eventOne(({eventArgs, asyncDone}) => {
      setTimeout(function(){
        counterAsync++;
        asyncDone();
      }, 100);
    });
    
    fluentEmitterInstanceOne.emit.eventOne({async: true, onAsyncCompleted: expectOnAsyncCompleted});
    
    function expectOnAsyncCompleted(){
        expect(counterAsync).to.be(2);
        done();
    }
  });
  
  it('should unsubcribe a listener from event', function(){
    let counter = 0;
    
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    let unsubcribeToken = fluentEmitterInstanceOne.on.eventOne(() => counter++);
    fluentEmitterInstanceOne.on.eventOne(() => counter++);
    unsubcribeToken.unsubscribe();
    
    fluentEmitterInstanceOne.emit.eventOne();
    
    expect(counter).to.be(2);
  });
});

describe('two instances of fluent emitter', function () {
  it('should not be the same object', function () {
    expect(fluentEmitterInstanceOne).not.to.be.equal(fluentEmitterInstanceTwo);
  });

  it('should have different events to listen on', function () {
    Object.keys(fluentEmitterInstanceOne.on).forEach((eventName) => {
      expect(fluentEmitterInstanceTwo.on).not.to.have.property(eventName);
    });
  });

  describe('when emitted event by one instance', function () {
    it('should be not listened on another instance', function () {
      let counter = 0;
      
      fluentEmitterInstanceOne.on.eventOne(() => counter++);
      fluentEmitterInstanceTwo.on.eventAlpha(() => counter++);

      fluentEmitterInstanceOne.emit.eventOne();
      fluentEmitterInstanceOne.emit.eventOne();
        
      expect(counter).to.be(2);
    });
  });
});

