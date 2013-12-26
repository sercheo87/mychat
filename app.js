/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    lessMiddleware = require('less-middleware');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(lessMiddleware({src: __dirname + '/public',compress: true}));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);

var users = {};
var userNumber = 1;
function getUsers () {
   var userNames = [];
   for(var name in users) {
     if(users[name]) {
       userNames.push(name);  
     }
   }
   return userNames;
}

io.sockets.on('connection', function (socket) {
    var myNumber = userNumber++;
    var myName = 'user#' + myNumber;
    users[myName] = socket;

    io.sockets.emit('listing', {count:myNumber, users:getUsers()});
    io.sockets.emit('userConnect', myName);

    console.log('A new user connected!');
    socket.emit('info', {
        msg: 'The world is round, there is no up or down.'
    });

    //Functions Ear
    socket.on('message', function (data) {
        console.log('SOCKET message:' + data);
        io.sockets.emit('message',{message:data.message, user:data.user});
    });

});

console.log("Express server listening on port 3000");