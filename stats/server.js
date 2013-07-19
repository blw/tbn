var express = require('express'),
    app = express();

var Stats = require('./stats.js');

app.get('/', function(req, res){
	res.send('Hello World');
});

app.get('/routerStats', function(req, res){
	var stats = new Stats(res); 
	stats.getStats();
	// stats.getStats(res);
	// res.send(data);
});

app.listen(3000);
console.log('Express server started on port 3000');




