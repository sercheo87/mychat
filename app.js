/*
Module Dependency
*/

var express = require('express');
var jade = require('jade');
var http = require('http');
var path = require('path');
var routes = require('./routes');

var app = express();
// Get module bootstrap 
var bootstrapPath = path.join(__dirname, 'node_modules', 'twitter-bootstrap-3.0.0');
var jqueryPath = path.join(__dirname, 'node_modules', 'jquery', 'dist');
var componentsPath = path.join(__dirname, 'components');

// Create Server
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('server', 'localhost');
app.set('port', 3033);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Compress all files less
app.use(require('less-middleware')({
    paths: [
        path.join(bootstrapPath, 'less'),
        path.join(componentsPath, 'font-awesome'),
        path.join(componentsPath, 'font-awesome', 'less')
    ],
    dest: path.join(__dirname, 'public', 'css'),
    src: path.join(__dirname, 'stylesheets'),
    prefix: '/css',
    compress: true,
    force: true
}));

// Global path exports
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(componentsPath));
app.use('/jquery', express.static(jqueryPath));
app.use('/bootstrap', express.static(path.join(bootstrapPath, 'dist')));

// Manager routes
app.get('/', routes.index);

// Up server
server.listen(app.get('port'), app.get('server'), function() {
    console.log('Server running on port ' + app.get('port'));
});

var usuariosOnline = {};

//SocketIo
io.sockets.on('connection', function(socket) {
    console.log('usuariosOnline:' + usuariosOnline);
    socket.emit("updateSidebarUsers", usuariosOnline);
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });

    socket.on("loginUser", function(username) {
        //si existe el nombre de usuario en el chat
        if (usuariosOnline[username]) {
            socket.emit("userInUse");
            return;
        }
        //Guardamos el nombre de usuario en la sesió n del socket para este cliente
        socket.username = username;
        //añadimos al usuario a la lista global donde almacenamos usuarios
        usuariosOnline[username] = socket.username;
        //mostramos al cliente como que se ha conectado
        socket.emit("refreshChat", "yo", "Bienvenido " + socket.username + ", te has conectado correctamente.");
        //mostramos de forma global a todos los usuarios que un usuario
        //se acaba de conectar al chat
        socket.broadcast.emit("refreshChat", "conectado", "El usuario " + socket.username + " se ha conectado al chat.");
        //actualizamos la lista de usuarios en el chat del lado del cliente
        io.sockets.emit("updateSidebarUsers", usuariosOnline);
    });

});