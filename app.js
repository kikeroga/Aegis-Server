const PORT = 3000;

// TODO とりあえず変数だけど将来的にはDB
var value1 = -1;
var value2 = -1;

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || PORT);
app.use(express.logger('dev'));
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var server = http.createServer(app);
var socket = server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// Receive
var io = require('socket.io').listen(socket);
io.sockets.on('connection', function(client) {
    console.log(client.id + ' connected');
    client.emit("init", getValuesJson());

    client.on('change', function(value) {
        console.log(client.id + ': ' + value);

        // update
        var json;
        try {
            json = JSON.parse(value); 
        } catch(e) {
            console.log(e);
            return;
        }

        if ('device1' == json.id) {
            value1 = json.value;
        } else if ('device2' == json.id) {
            value2 = json.value;
        } else {
            return ;
        }

        var message = getValuesJson();

        client.emit('update', message);
        client.broadcast.emit('update', message);
    });

    client.on('disconnect', function() {
        console.log('disconnected by: ' + client.id);
    });
});

function getValuesJson() {
    return '{"device1" : ' + value1 + ','
          + '"device2" : ' + value2 + '}';
}

/*
// heroku用
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});
*/

