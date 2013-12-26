$(document).ready(function(){
  $('#alerts').css('visibility','hidden');

  $("#Send").click(function() {
    sendMessage($('#Message').val());
    $('#Message').val('');
  });
  
});