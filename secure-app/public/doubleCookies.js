/*
    - prevents form from submitting mutiple times
    - when the form submits, a cookie is set to the browser to indicated submitted form
    - server checks if the cookies existed before and rejects if cookies is present 
    - prevents duplicate form submission and ensure data is not overwritten
*/


// sets a cookie with the given name and value
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";

    const test = document.cookie
    console.log("this " + test)
}

// uses the getCookie() function to check if a cookie with the name "csrf_token" already exists
// retrieves the cookie and sets the hidden value in the file to be the same value
// if it doesnt exist it will generate a new token
function setDoubleSubmitCookie() {
    var token = Math.random().toString(36).substring(3, 16) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8)
    // generates number beteen 0 and 1,
    // toString converts to string base 36, means numbers 0-9 and letters a-z,
    // function returns the portion starting from 3rd to 16th character.
    // add again to add length

    // set the cookie there
    setCookie('csrf_token', token);

    const token_value = document.getElementById('csrf_token')
    token_value.value = token;

    console.log("Cookie: " + token_value.value)
}

// Get the value of the csrf_token cookie
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    console.log(parts)

    if (parts.length === 2) {
        const generatedToken = parts.pop().split(';').shift()
        console.log("Generated: " + generatedToken)
        return generatedToken;
    }
}

// function getCookie(name) {
//     const regex = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`);
//     return document.cookie.replace(regex, '$1');
// }
// validates username only allow alphanumeric 
function checkUsername(username) {
    const pattern = /^[a-zA-Z0-9]+$/;
    return pattern.test(username)
}

// validates email
function checkEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email) // built-in js method to check if string matches regex
}

// validates password 
function checkPassword(password) {
    const pattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,16}$/g;
    return pattern.test(password)
}

function performChecks() {
    const form = document.getElementById("register-form")

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
    })

    const regUsername = document.getElementById("username").value
    const regEmail = document.getElementById("email").value
    const regPassword = document.getElementById("password").value

    if (!regUsername || !regEmail || !regPassword) {
        alert("Please enter all fields.")
       
    } else if (!checkUsername(regUsername)) {
        alert("Username should only have alphanumeric characters!.")
    } else if (!checkEmail(regEmail)) {
        alert("Email is in incorrect format.")
    } else if (!checkPassword(regPassword)) {
        alert("Password should have 8 - 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character.")
    } else {
        submitForm()
    }
}

function submitForm() {
    document.getElementById("show-loading").innerHTML = "Loading...";

    // put token to hidden value on form
    setDoubleSubmitCookie()

    // Get the value of the csrf_token hidden field
    const getToken = document.getElementById("csrf_token").value
    const getCookieToken = getCookie('csrf_token')

    console.log("Compare cookie token and user token: " + getCookieToken + " | " + getToken)

    // Check if the values match
    if (getToken === getCookieToken) {
        // The values match, so the form submission is valid
        console.log("Cookies match! Form submitted!")
    } else {
        console.log("Cookies Verification Failed. " + getToken)
    }

}
