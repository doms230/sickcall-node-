/**
 * Created by d_innovator on 2/12/17.
 */


$(function(){
    var parse = require("parse").Parse;
    parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
//;lkjdsfg;lk

    //location
    $('#locationDiv').append('<div class="container-fluid">' +

    '<h4>Location - <small>1210 S Lamar St</small> </h4>' +

    '<iframe src="//www.google.com/maps/embed/v1/place?q=32.7787196880853,-96.7693720605207' +
        '&zoom=17' +
        '&key=AIzaSyAdnr849aDFzuYIJBTqyzdapF_7aR8AikI">' +
        '</iframe>' +

    '</div>' );

    //messages

    $('#messageDiv').append( '<div class="container-fluid">' +
        '<div class="media">' +
            '<div class="media-left">' +
                '<img class="img-circle" src= /images/logo.png alt="..." width="64" height="64" >' +
            '</div>' +
            '<div class="media-body">' +
                '<h4 class="media-heading"> Dom Smith <small> 10/12/16 </small></h4>' +
                'Heyyyyy what\'s upppppppppppp lalalalalalalallalalalalalalal okay okay pokay okay okay ' +
            '</div>' +
        '</div>' +
    '</br>' +
    '</div>' );

    $('#messageBarDiv').hide();


    //rsvp

    $('#rsvpDiv').append(
        '<div class="container-fluid">' +
            '<div class="media">' +
                '<div class="media-left">' +
                    '<img class="img-circle" src= /images/logo.png alt="..." width="64" height="64" >' +
                '</div>' +
                '<div class="media-body">' +
                    '<h4 class="media-heading"> Dom Smith</h4>' +
                    'd_innovator' +
                '</div>' +
             '</div>' +
        '</br>' +
        '</div>' );

    $('#location').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#rsvpDiv').hide();
        $('#messageDiv').hide();
        $('#messageBarDiv').hide();
        $('#locationDiv').show();
    });

    $('#messages ').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#locationDiv').hide();
        $('#rsvpDiv').hide();
        $('#messageDiv').show();
        $('#messageBarDiv').show();
    });

    $('#rsvps ').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#locationDiv').hide();
        $('#messageDiv').hide();
        $('#messageBarDiv').hide();
        $('#rsvpDiv').show();
    });
});


