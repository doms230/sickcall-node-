/**
 * Created by macmini on 5/7/17.
 *
 *  watchify public/javascripts/welcomeScripts.js -o public/javascripts/welcomeBundle.js -v
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var currentUser = parse.User.current();

$(function(){
    /*if (currentUser){
        window.location.href = "https://www.hiikey.com/home";
    }*/

    console.log(window.location.href);
    console.log(window.location);
});