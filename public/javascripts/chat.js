/**
 * Created by macmini on 2/2/17.
 * https://ponyfoo.com/articles/a-gentle-browserify-walkthrough
 * https://scotch.io/tutorials/getting-started-with-browserify
 */


$(function(){

    /*var moment = require("moment-timezone");

    var date = new Date();
    var ya = moment.tz(date, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

    alert("Date: " + date + "momentDate: " + ya);*/
    var parse = require("parse").Parse;
    parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
    var query = new parse.Query('Chat');
    var subscription = query.subscribe();

    subscription.on('open', () => {
        //console.log('subscription opened');
        alert("sub opened");
    });

    subscription.on('create', (object) => {
        //console.log('object created: ' + object.get('message'));
        alert('object created: ' + object.get('message'))
    });

});



