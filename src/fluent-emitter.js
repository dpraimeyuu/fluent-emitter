import { curry } from 'ramda';
import { forEach as forEachAsync } from 'async';

function FluentEmitter(eventNames) {
	let callbacks = {};
	const _on = curry((eventName, callback) => {
		if (!callbacks[eventName]) {
			callbacks[eventName] = [];
		}
		callbacks[eventName].push(callback);

		return {
			unsubscribe: function callbackUnsubscribe(){
				callbacks[eventName].splice(callbacks[eventName].indexOf(callback), 1);
			}
		};
	});

	const _emit = curry((eventName, eventArgs = {}) => {
		if (!callbacks[eventName]) return;

		let {async, onAsyncCompleted} = eventArgs;
		if (async) {
			onAsyncCompleted = onAsyncCompleted || function noop() { };
			forEachAsync(callbacks[eventName], (c, asyncDone) => c({eventArgs, asyncDone}), onAsyncCompleted);
		} else {
			callbacks[eventName].forEach((c) => c({eventArgs}));
		}
	});
	
	const _clearListeners = function clearListeners() {
		callbacks = {};
	};
	
	_clearListeners.for = {};

	const on = {};
	const emit = {};

	eventNames.forEach((eventName) => {
		on[eventName] = ((eventArgs) => _on(eventName, eventArgs));
		emit[eventName] = ((eventArgs) => _emit(eventName, eventArgs));
		_clearListeners.for[eventName] = () => callbacks[eventName] = []; 
	});

	this.on = on;
	this.emit = emit;
	this.clearListeners = _clearListeners;
}

export default FluentEmitter;