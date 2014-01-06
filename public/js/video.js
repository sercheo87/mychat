/*
Implementation of Matt West's excellent "Accessing the Device Camera with getUserMedia" article found at http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
*/

window.onload = function() {

    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    // Grab elements, create settings, etc.
    var canvas = document.getElementById("photoElement");
    var context = canvas.getContext("2d");
    var video = document.getElementById("videoElement");

    // Check that the browser supports getUserMedia.
    // If it doesn't show an alert, otherwise continue.
    if (navigator.getUserMedia) {
        // Request the camera.
        navigator.getUserMedia(
            // Constraints
            {
                video: true
            },

            // Success Callback
            function(localMediaStream) {
                // Get a reference to the video element on the page.
                var vid = document.getElementById('videoElement');

                // Create an object URL for the video stream and use this 
                // to set the video source.
                vid.src = window.URL.createObjectURL(localMediaStream);
            },

            // Error Callback
            function(err) {
                // Log the error to the console.
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );

    } else {
        alert('Sorry, your browser does not support getUserMedia');
    }

    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });
    
    // Converts canvas to an image
    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }
}

$(function() {
    var idEffect = 1;

    $('#btPageBack').click(function(event) {
        idEffect--;
        if (idEffect == 0) {
            idEffect = 1;
        }
        apllyEffectVideo(idEffect);
    });

    $('#btPageNext').click(function(event) {
        idEffect++;
        if (idEffect == 9) {
            idEffect = 1;
        }
        apllyEffectVideo(idEffect);
    });

    $('#btPageDefaulr').click(function(event) {
        idEffect = 6;

        apllyEffectVideo(idEffect);
    });

    function apllyEffectVideo(item) {
        if (item == 1) {
            $('#videoElement').css('-webkit-filter', 'blur(3px)');
        }
        if (item == 2) {
            $('#videoElement').css('-webkit-filter', 'grayscale(1)');
        }
        if (item == 3) {
            $('#videoElement').css('-webkit-filter', 'sepia(1)');
        }
        if (item == 4) {
            $('#videoElement').css('-webkit-filter', 'brightness(2.5)');
        }
        if (item == 5) {
            $('#videoElement').css('-webkit-filter', 'contrast(5)');
        }
        if (item == 6) {
            $('#videoElement').css('-webkit-filter', 'hue - rotate(125deg)');
        }
        if (item == 7) {
            $('#videoElement').css('-webkit-filter', 'opacity(0.3)');
        }
        if (item == 8) {
            $('#videoElement').css('-webkit-filter', 'invert(1)');
        }
        if (item == 9) {
            $('#videoElement').css('-webkit-filter', 'saturate(3)');
        }
    }
});