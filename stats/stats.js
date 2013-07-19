module.exports = function(res) {

var configData = require('./config.js');

var command = "wl assoclist | awk '{print \"echo \"$2\"\"; \"echo -\"; print \"wl rssi \"$2\"\"; print \"echo ,\"}' | sh";

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

            // var arr = list.split(',');

            // var i, val;

            // for (i = 0; i < arr.length; i++) {

            //     val = arr[i];

            //     if (val.trim().length > 0) {

            //         console.log(val.replace(/(\r\n|\n\r)/gm, "-"));

            //     }

            // }

            res.send(data);
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
