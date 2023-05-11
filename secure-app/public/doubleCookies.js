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
    // var token = crypto.randomBytes(16).toString('hex');
    var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setCookie('csrf_token', token);

    const token_value = document.getElementById('csrf_token')
    token_value.value = token;

    console.log("Cookie: " + token_value.value)
}

// Get the value of the csrf_token cookie
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

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
