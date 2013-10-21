$(function() {
    var socket = io.connect('/');
    socket.on('valueUpdate', function (data) {
        $('#device1').html(data);
    });
});
