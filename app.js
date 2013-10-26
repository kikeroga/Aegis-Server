const PORT = 3000;

// TODO DBとかにする
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

    //client.on('change', function(decimal) {
    client.on('change', function(decimal) {
        var value = decimal;
        console.log(client.id + ': ' + value);

        client.emit('update', value);
        client.broadcast.emit('update', value);
    });

    client.on('disconnect', function() {
        console.log('disconnected by: ' + client.id);
    });
});

// heroku用に必要な処理らしい
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});
