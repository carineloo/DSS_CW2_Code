document.cookie = "my_username_is_so_cool"
document.cookie = "super_safe_password_amirite"

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var query = new URL(window.location).searchParams.get('query')

    document.getElementById('query-input').value = query
    document.getElementById('query-output').innerHTML = query
}

/* ---------------------------------------------------------------------- */

function formStopRefresh(e) {
    e.preventDefault();
}
document.getElementById("form-id").addEventListener('submit', formStopRefresh);

const tag = (text) => {
    const element = document.createElement('tag')
    element.innerText = text
    return element.outerHTML
}

function convertText() {
    const input = document.getElementById('query-input')
    const converted = tag(input.value)
    console.log(converted)
}

// const convert = (e) => {
//     const input1 = document.getElementById('query-input')
//     e = input1.value
//     console.log(e) 
// }

// console.log(tag('<div>'))
// console.log('<div>')


/* 
XSS:

1.
<img src onerror="alert('hacked')" />

- change innerHTML to innerText
- convert all input into a string and will never render any of the values as HTML
- if innerHTML is really needed, use sanitization in order to convert the user input from HTML into a normal string by escaping all HTML specific characters.
- https://blog.webdevsimplified.com/2020-09/javascript-xss/

2.
- encode data on output
- using html entities

*/

