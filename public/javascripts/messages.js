var showAlert = function () {
    $('#alerts')
      .css('visibility','visible')
      .html('<div class="alert alert-info"><p>New messages added!!!</p></div>');

    $('.alert').animate({
        opacity: 0
      }, 5000, 
      function() {
        // Animation complete.
        $('#alerts').css('visibility','hidden');
        $('.alert').remove();
      }
  );
};