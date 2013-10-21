
/* Configuration */

// TODO DBとかにする
var value1 = -1;
var value2 = -1;

var express = require('express');
var routes = require('./routes/main.js');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var $ = require('jquery');
var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------------------------------------------------------------------//

app.get('/', routes.index);
// app.get('/users', user.list);

var socket = server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(socket);

io.sockets.on('connection', function(client) {
    console.log('connected by: ' + client.id);

    client.on('valueUpdate', function(decimal) {
        value1 = decimal;
        console.log('device1 receive: ' + value1);

/*
        // $('#device1').html(value1);
        $('#device1').prepend(value1);
        console.log('Set value');
*/

/*
        client.emit('valueChange', value1);
        //socket.broadcast.emit('value change', value1);
*/
        client.emit('valueChange', value1);
        //socket.broadcast.emit('value change', value1);
    });

    client.on('disconnect', function() {
        // disconnect
        console.log('disconnected by: ' + client.id);
    });
});
