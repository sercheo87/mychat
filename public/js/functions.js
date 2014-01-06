var socket = io.connect('http://localhost:3033');
socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', {
        my: 'data'
    });
});

socket.on("refreshChat", function(action, message) {
    console.log('conectado:' + message);
});

//actualizamos el sidebar que contiene los usuarios conectados cuando
//alguno se conecta o desconecta, el parámetro son los usuarios online actualmente
socket.on("updateSidebarUsers", function(usersOnline) {
    //limpiamos el sidebar donde almacenamos usuarios
    $("#chatUsers").html("");
    //si hay usuarios conectados, para evitar errores
    if (!isEmptyObject(usersOnline)) {
        //recorremos el objeto y los mostramos en el sidebar, los datos
        //están almacenados con {clave : valor}
        $.each(usersOnline, function(key, val) {
            $("#chatUsers").append("<div class='form-group col-md-12 alert-info'><p><i class='fa fa-user'></i>  " + key + "</p></div>");
        })
    }
});

//si el usuario está en uso lanzamos el evento userInUse y mostramos el mensaje
socket.on("userInUse", function() {
    //eliminamos la sesión que se ha creado relacionada al usuario
    manageSessions.unset("login");
    $('#messages').show();
    $('#messages').animate({
        opacity: 1
    }, 1000);
    $('#messages').html('<p>El usuario que desea utilizar ya esta en uso.<p>');
    //ocultamos el mensaje
    setTimeout(function() {
        $('#messages').animate({
            opacity: 0
        }, 1000,function(){
            $('#messages').hide();
        });
    }, 2000);
});

$(document).ready(function() {
    //se limpia login en la recarga de la pagina
    manageSessions.unset("login");
    $('#messages').hide();
});

var usersManage = {
    create: function(user) {
        //en otro caso, creamos la sesión login y lanzamos el evento loginUser
        //pasando el nombre del usuario que se ha conectado
        manageSessions.set("login", user);
        socket.emit("loginUser", manageSessions.get("login"));
    }
};

//objeto para el manejo de sesiones
var manageSessions = {
    //obtenemos una sesión //getter
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    //creamos una sesión //setter
    set: function(key, val) {
        return sessionStorage.setItem(key, val);
    },
    //limpiamos una sesión
    unset: function(key) {
        return sessionStorage.removeItem(key);
    }
};

//función que comprueba si un objeto está vacio, devuelve un boolean
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}