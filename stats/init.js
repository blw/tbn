var SAMPLES = 8;
var SAMPLE_RATE = 300;

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

function getStats(){
	var address,
		result = {};

	for(address in tracked){
		if(tracked.hasOwnProperty(address)){
			result[address] = {
				mac: address,
				signal: tracked[address].average,
				trend: tracked[address].trend,
				min: tracked[address].min,
				max: tracked[address].max,
				range: tracked[address].range,
				isClose: tracked[address].isClose,
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

//			console.log(address, stats[address].isClose);
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
				if(!(address in tracked)) tracked[address] = { close: false, mac: address, signals: [], min: 9999, max: -9999 };
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

			var waiting = devices.length;

			devices.forEach(function(device){
				connection.exec('wl rssi ' + device.mac, function(err, data){
					waiting--;
					var signalValue = data.trim().replace('\n', '');
					signalValue = parseInt(signalValue, 10);

					if(device.min > signalValue){
						device.min = signalValue;
					}

					if(device.max < signalValue){
						device.max = signalValue;
					}

					device.signals.unshift(signalValue);
					if(device.signals.length > SAMPLES){
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
					if(Math.abs(device.average) < Math.abs(device.min + (device.range / 2))){
						//console.log(device.average, (device.min + (device.range / 2)));
						device.isClose = true;
					} else {
						device.isClose = false;
					}

					var leastSquares = findLineByLeastSquares(valuesX, device.signals.slice());
					var leastSquaresX = leastSquares[0];
					var leastSquaresY = leastSquares[1];
					device.leasSquares = leastSquaresY;

					if(device.signals.length === 8){
						device.trend = (device.signals[0] + device.signals[1]) - (device.signals[6] + device.signals[7]);
							
						if(Math.abs(device.trend) > TREND_MAGNITUDE){
					//		device.isClose = (device.trend > 0);
						}
					}
				});
			});
		});
	}, SAMPLE_RATE);
});

connection.connect(connectionConfig);

function notEmpty(str){return str.trim() != '';};


function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;
    
    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;
    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }
    
    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }
    
    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }
    
    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;
    
    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];
    
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }
    
    return [result_values_x, result_values_y];
}