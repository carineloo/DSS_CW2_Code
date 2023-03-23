//// example of account data ////
var objPeople=[
    {
        email: 'someone@gmail.com',
        password: 'someone'
    },
    {
        email: 'abc@gmail.com',
        password: '12345'
    }
]

//// validation of login system ////
function login(){
    var email =  document.getElementById('email').value
    var password = document.getElementById('password').value
    // console.log('your email address is ' + email + 'and your password is ' + password);

    var validLogin = false;
    for(var i = 0; i < objPeople.length; i++){
        if(email == objPeople[i].email && password == objPeople[i].password){
            validLogin = true;
            console.log(email + ' is logged in !!!')
            break;
        }
    }

//// creating the error message ////
    if (!validLogin){
        document.getElementById('error-message').innerHTML = 'Incorrect email or password.';
        console.log('wrong input!')
        return false;
    }else{
        document.getElementById('error-message').innerHTML = '';
    }
    
}


//// register new user account ////
function registerUser(){
    var registerEmail =  document.getElementById('newEmail').value
    var registerPassword = document.getElementById('newPassword').value
    var newUser = {
        email: registerEmail,
        password: registerPassword
    }

    for(i = 0; i < objPeople.length; i++){
        if(registerEmail == objPeople[i].email){
            alert('WARNING: this email address is already in use!')
            return
        }
        // else if(registerPassword.length < 3){
        //     alert('this password is too short, it needs to be more than 3 characters')
        // }
    }

    objPeople.push(newUser)
    console.log(objPeople)
    
}

