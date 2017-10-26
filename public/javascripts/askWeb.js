
  

$(function(){
    console.log("hey");
    
   // document.getElementById('sign-in-form').addEventListener('submit', onSignInSubmit);
   
    $('#sign-in-form').click(function () {
        console.log("signin");
        //onSignInSubmit();

    });

});

  function getPhoneNumberFromUserInput() {
    return document.getElementById('phone-number').value;
  }
