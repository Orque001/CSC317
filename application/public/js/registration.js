let usernameValid = false;
let emailValid = false;
let passwordValid = false;
let confirmPasswordValid = false;

document.getElementById('username').addEventListener('input', function(ev){
    let userInput = ev.target;
    let username = userInput.value; 
    const validChars = /^[0-9a-zA-z]/;

    if(username.length >= 3 && validChars.test(username.at(0))){
        userInput.classList.add('valid-text');
        userInput.classList.remove('invalid-text');
        usernameValid = true;
    }else {
        userInput.classList.add('invalid-text');
        userInput.classList.remove('valid-text');
        usernameValid = false;
    };
})

document.getElementById('email').addEventListener('input', function(ev){
    let emailInput = ev.target;
    let email = emailInput.value;
    const validChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (validChars.test(email)) {
        emailInput.classList.add('valid-text');
        emailInput.classList.remove('invalid-text');
        emailValid = true;
    } else {
        passwordElement.classList.add('invalid-text');
        passwordElement.classList.remove('valid-text');
        emailValid = false;
    };   
})

document.getElementById('password').addEventListener('input', function(ev){
    let passwordInput = ev.target;
    let password = passwordInput.value;
    const validChars = /^(?=.*\d)(?=.*[!@#$%^&*\[\]])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if(validChars.test(password)){
        passwordInput.classList.add('valid-text');
        passwordInput.classList.remove('invalid-text');
        passwordValid = true;
    }else {
        passwordInput.classList.add('invalid-text');
        passwordInput.classList.remove('valid-text');
        passwordValid = false;
    };
})

document.getElementById('confirmPassword').addEventListener('input', function(ev){
    let confirmPasswordInput = ev.target;
    let confirmPassword = confirmPasswordInput.value; 

    if(confirmPassword == document.getElementById('password').value){
        confirmPasswordInput.classList.add('valid-text');
        confirmPasswordInput.classList.remove('invalid-text');
        confirmPasswordValid = true;
    }else {
        confirmPasswordInput.classList.add('invalid-text');
        confirmPasswordInput.classList.remove('valid-text');
        confirmPasswordValid = false;
    };
})

document.getElementById('submit').addEventListener('click', function(prevent) {
    if (!usernameValid || !emailValid || !passwordValid || !confirmPasswordValid) {
        if (!usernameValid){
            alert("Invalid username. Must more 3 or more alphanumeric characters.");
        }
        if (!emailValid){
            alert("Invalid email.");
        }
        if (!passwordValid){
            alert("Invalid password. Must be 8 or more characters, have atleast one uppercase, have atleast one number, AND have atleast one special character.");
        }
        if (!confirmPasswordValid){
            alert("Password does not match.");
        }
        prevent.preventDefault();
    }
})