module.exports = function(res) {

var configData = require('./config.js');

var command = "wl assoclist | awk '{print \"echo \"$2\" ; echo ,; wl rssi \"$2\"; echo .\"}' | sh";

var Connection = require('ssh2');

var c = new Connection();

c.on('connect', function() {

    console.log('Connection:connect');

});

c.on('ready', function() {

    console.log('Connection :: ready');

    c.exec(command, function(err, stream) {

        if (err)
            throw err;

        stream.on('data', function(data, extended) {
            // convert to string
            var list = '' + data;

            var sets = list.split('.');

            var i, val, result = [];

            for (i = 0; i < sets.length; i++) {

                val = sets[i];

                if (val.trim().length > 0) {
                    var set = val.split(',');
                    if (set.length === 2) {
                        result.push({mac:set[0].trim(), signal:set[1].trim()});
                    }

                }

            }

            res.send(result);
        });

        stream.on('end', function() {

            console.log('Stream :: EOF');

        });

        stream.on('close', function() {

            console.log('Stream :: close');

        });

        stream.on('exit', function(code, signal) {

            console.log('Stream :: exit :: code: ' + code + ', signal: '
                    + signal);

            c.end();

        });

    });

});

c.on('error', function(err) {

    console.log('Connection :: error :: ' + err);

});

c.on('end', function() {

    console.log('Connection :: end');

});

c.on('close', function(had_error) {

    console.log('Connection :: close');

});

this.getStats = function () {
     // console.log('gannnnnn');
    c.connect(configData);
} 

}
