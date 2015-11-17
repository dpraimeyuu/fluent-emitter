Docs v.1.0

Why?
===================
Imagine you have a code base, let's say it has around 200 lines of code.
Imagine somewhere in that code you're using event based mechanism to orchestrate some application logic.
Imagine there's only one particular object that uses 3 simple events: EventAlpha, EventBeta and EventOmega.

From that kind of perspective it looks quite obvious to manage all the emits and ons. Somewhere in those 200 lines of code one of event is emitted, somewhere else is being listened on.

Your project got a bit bigger and now imagine that you have code base, consisting of only 800 lines of code, split into two files, each of 400 lines of code. Instead of one object emitting some events, you have, let's say two of them. Each emits 4 events.

Again, it doesn't look so scary, because there are only two objects. What would be if there are three? Four? Nah, you'll manage.

Fluent Emitter is a small implementation that helps in managing event mechanisms. It does it by placing all events definitions in one place.

You just need to provide an array with event names to the factory function and you will get one, new and shiny fluent emitter instance which gives simple interface for listening and emitting events.

Look on that:
```js
const bestEmitter = fluentEmitter(['eventAlpha', 'eventBeta', 'eventOmega']);
```

It's that simple. How to use it? Let's listen on a first event:
```js
bestEmitter.on.eventAlpha(() => console.log('event alpha, are you there?'));
```

And now let's start the show:
```js
bestEmitter.emit.eventAlpha();
```

Nothing more, nothing less. Did you notice another small benefit? If you make any mistake in the event name then you will see beautiful exception saying in which line you had used bad method name. Yes, event name = method name. Another helpful guard.

API
===
The best advice is to look into tests and see fluent emitter in action. All the methods below depend on event names defined while creating instance of the emitter. So let's assume we are using two events:
```js
const trainingEmitter = fluentEmitter(['eventOne', 'eventTwo']);
```

emit
---
Method used for emitting the specific event.
```js
trainingEmitter.emit.eventOne(({myArg: 'argument 1'});
```

emit async
---
Method used for emitting asynchronous events.
There is also possibility to handle callbacks asynchronously. Passed object needs to be slightly modified to do so. Like that:
```js
trainingEmitter.emit.eventOne(({myArg: 'argument 1', async: true, onAsyncCompleted: () => doStuffWhenAllCallbacksWereProcessed()});
```

on
---
Method used for listening on the specific event. 
```js
const invokeMeToUnsubscribe = trainingEmitter.on.eventOne(({myArg}) => console.log(myArgs)); // 'argument 1'
```
As you may have spotted, something which can be used for unsubscribing the event was returned after passing a callback to a emitter. In order to use its powers you have to invoke it. It will remove just passed callback from the listeners.
```js
invokeMeToUnsubscribe();
```
That's it. 

async on
---
Method used for asynchronously listening on events.

In addition to regular listening on events, fluent emitter can process them asynchronously. Async option can be set when emitting an event. Then when that's how async on looks like:

```js
trainingEmitter.on.eventOne(({eventArgs, asyncDone}) => {
      setTimeout(function(){
        counterAsync++;
        asyncDone();
      }, 100);
    });
```

Here async operation is simulated as timeout function. You can notice that there asyncDone callback passed as an argument and whenever async operation will be finished you have to invoke asyncDone to mark it as done. Whenever all asynchronous operations would be successfully processed, then onAsyncComplete callback from emit will be executed.
clearListeners
---
Method used for clearing all listeners for specific event or for all events.

Let's say we want to clear all listeners for eventOne:
```js
trainigEmitter.clearListeners.for.eventOne();
```

If it's not sufficient, then all listeners can be cleared:
```js
trainingEmitter.clearListeners();
```

So you may have spotted that clearListeners  has property 'for' which returns all available methods corresponding to initially declared events.

Executing clearListeners method as a regular method clears all listeners.

