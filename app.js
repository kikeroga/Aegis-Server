
/**
 * Module dependencies.
 */

// TODO DBとかにする
var value1 = -1;
var value2 = -1;

var express = require('express');
var routes = require('./routes/main.js');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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

app.get('/', routes.index);
app.get('/users', user.list);

// Ready for Socket.io
var socket = server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//----------------------------------------------------------------------//

// 値の変更を受け取ったとき
socket.on('connection', function(client) {
  // connect
  client.on('value update', function(decimal) {
    value1 = decimal;
    console.log('device1 receive: ' + value1);

    socket.emit('value change', value1);
    socket.broadcast.emit('value change', value1);
  });
  client.on('disconnect', function() {
    // disconnect
  });
});
