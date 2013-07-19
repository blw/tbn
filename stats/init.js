var SAMPLES = 8;
var SAMPLE_RATE = 300;
var MIN_RANGE = 10;
var TREND_MAGNITUDE = 10;

var connectionConfig = require('./config.js');
var Connection = require('./connection.js');
var express = require('express');

var connection = new Connection(connectionConfig);

var app = express();

app.get('/', function(req, res){
	res.send('Hello World');
});

app.get('/stats', function(req, res){
	res.send(getStats());
});

app.get('/cheat', function(req, res){
	if(req.query.mac in tracked){
		var device = tracked[req.query.mac];

		if('set' in req.query){
			switch(req.query.set){
				case 'isClose':
					if('val' in req.query) device.cheat.isClose = req.query.val;
					else delete device.cheat.isClose;
					break;
				case 'max':
					device.max = parseInt(req.query.max, 10);
					break;
				case 'min':
					device.min = parseInt(req.query.min, 10);
					break;
			}
		} else if ('reset' in req.query){
			tracked[req.query.mac] = { cheat: {}, close: false, mac: req.query.mac, signals: [], min: 9999, max: -9999 };
		}
	}

	res.send(getStats());
});

function getStats(){
	var address,
		result = {};

	for(address in tracked){
		if(tracked.hasOwnProperty(address)){
			var isClose = tracked[address].isClose;
			if(tracked[address].cheat.isClose !== undefined) isClose = tracked[address].cheat.isClose == 'true' && true || false;

			result[address] = {
				mac: address,
				signal: tracked[address].average,
				min: tracked[address].min,
				max: tracked[address].max,
				range: tracked[address].range,
				isClose:  isClose,
				cheat: tracked[address].cheat
			};
		}
	}

	return result;
}

app.listen(3000);

var tracked = {};

var isClose = {};
setInterval(function(){
	var stats = getStats();
	for(address in stats){
		if(tracked.hasOwnProperty(address)){
			if(isClose[address] !== stats[address].isClose){
				isClose[address] = stats[address].isClose;
				console.log(address + ' is now ' + (isClose[address]? "close" : "far") );
			}
		}
	}
}, 1000);

connection.on('ready', function(){
	setInterval(function(){
		connection.exec('wl assoclist', function(err, data){
			for(address in tracked){
				if(tracked.hasOwnProperty(address)){
					tracked[address].touched = false;
				}
			}

			var devices = data.split('\n').filter(notEmpty).map(function(item){
				var address = item.split(' ')[1];
				if(!(address in tracked)) tracked[address] = { cheat: {}, isClose: false, mac: address, signals: [], min: 9999, max: -9999 };
				tracked[address].touched = true;

				return tracked[address];
			});

			for(address in tracked){
				if(tracked.hasOwnProperty(address)){
					if(!tracked[address].touched){
						delete tracked[address];
					}
				}
			}

			devices.forEach(function(device){
				connection.exec('wl rssi ' + device.mac, function(err, data){
					var signalValue = data.trim().replace('\n', '');
					signalValue = parseInt(signalValue, 10);


					device.signals.unshift(signalValue);
					if(device.signals.length > SAMPLES){
						if(device.min > signalValue){
							device.min = signalValue;
						}

						if(device.max < signalValue){
							device.max = signalValue;
						}
						
						device.signals.pop();
					}

					var total = device.signals.reduce(function(prev, curr){
						return prev + curr;
					});

					device.average = total / device.signals.length;

					var valuesX = [];
					for(var i = 0; i < device.signals.length; i++){
						valuesX.push(i * SAMPLE_RATE);
					}

					device.range = device.max - device.min;
					if(device.range > MIN_RANGE){
						if(Math.abs(device.average) < Math.abs(device.min + (device.range / 2))){
							device.isClose = true;
						} else {
							device.isClose = false;
						}
					}

					
					//if(device.signals.length === 8){
					//	device.trend = (device.signals[0] + device.signals[1]) - (device.signals[6] + device.signals[7]);
							
					//	if(Math.abs(device.trend) > TREND_MAGNITUDE){
					//		device.isClose = (device.trend > 0);
					//	}
					//}
				});
			});
		});
	}, SAMPLE_RATE);
});

connection.connect(connectionConfig);

function notEmpty(str){return str.trim() != '';};