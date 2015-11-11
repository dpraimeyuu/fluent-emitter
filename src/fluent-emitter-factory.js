import FluentEmitter from './fluent-emitter';

function fluentEmitter(eventNames){
	return new FluentEmitter(eventNames);
}

export default fluentEmitter;