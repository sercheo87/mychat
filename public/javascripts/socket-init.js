var objUser;

console.log('el usuario actual es:'+objUser);
if(objUser=='')
{
console.log('existe usuario');
}else{
console.log('no existe usuario');
}
  // connect to the socket server
  socket = io.connect('http://localhost:3000');

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('info', function (data) {
    console.log('info:' + data);
});

socket.on("connect", function () {
    console.log("Conectado");
});

socket.on("message", function (data) {
    var d = new Date();
    var time = ((d.getHours() < 10)?("0" + d.getHours()):d.getHours()) + ":" + ((d.getMinutes() < 10)?("0" + d.getMinutes()):d.getMinutes()) + ":" + ((d.getSeconds() < 10)?("0" + d.getSeconds()):d.getSeconds());
    
    $('#Messages').append('['+time+'] ' + data.user + ':' + data.message + '<br/>');
    showAlert();
});


socket.on('listing', function (data) {
   users = data; 
   console.log(data.count+' users:'+data.users);
});

socket.on('userConnect', function (user) {
  objUser=user;
  console.log("objUser:"+objUser);
});

//FUNCTIONS FOR ALL
var sendMessage=function(message){
  console.log('Function sendMessage :'+message);
  socket.emit('message', {
       user: objUser,
       message: message
    });
};