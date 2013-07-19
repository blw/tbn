var EventEmitter = require('events').EventEmitter;
var ssh2 = require('ssh2');

var Connection = module.exports = function(config){
	this.connection = new ssh2();

	this.connection.on('connect', this.connectHandler.bind(this));
	this.connection.on('ready', this.readyHandler.bind(this));
	this.connection.on('error', this.errorHandler.bind(this));
	this.connection.on('end', this.endHandler.bind(this));
	this.connection.on('close', this.closeHandler.bind(this));
};
Connection.prototype = Object.create(EventEmitter.prototype);

Connection.prototype.connect = function(config){
	this.connection.connect(config);
};

Connection.prototype.connectHandler = function(){
	this.emit('connect');
	console.log('Connection connect', arguments);
};

Connection.prototype.readyHandler = function(){
	this.emit('ready');
	console.log('Connection ready', arguments);
};

Connection.prototype.exec = function(command, callback) {
	this.connection.exec(command, streamCollector(callback));
};

Connection.prototype.errorHandler = function(){
	this.emit('error');
	console.log('Connection error', arguments);
};

Connection.prototype.endHandler = function(){
	this.emit('end');
	console.log('Connection ended');
};

Connection.prototype.closeHandler = function(){
	this.emit('close');
	console.log('Connection closed');
};


function streamCollector(callback){
	return function(err, stream){
		if(err) callback(err);
		var collectedData = '';

		stream.on('data', function(data, extended){
			collectedData += data;
		});

		stream.on('end', function(){
			callback(null, collectedData);
		});
	};
}