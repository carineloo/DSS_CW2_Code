// validates input (looks for special characters)
function checkInput(input) {
    const pattern = /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/
    return pattern.test(input)
}

// show input on console
function input() {
    const int = document.getElementById("query-input").value
    if (checkInput(int)) {
        console.log("Special characters not allowed.")
    }
}

// file inclusion
function fileSubmit() {
    const file = document.getElementById("file").value
    // remove file path
    const fileName = file.replace(/^.*[\\\/]/, '')

    if (checkInput(fileName)) {
        document.getElementById("file-submit").innerHTML = "File name should not have special characters."
    } else if (file) {
        document.getElementById("file-submit").innerHTML = fileName + " file accepted."
        setTimeout(() => {
            document.getElementById("file-submit").innerHTML = ""
        }, 3000)
    } else {
        document.getElementById("file-submit").innerHTML = "No file selected."
    }
}

// get file
const file = document.querySelector("#file") // input

file.addEventListener("change", function () {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        document.querySelector("#image").src = reader.result
    })
    reader.readAsDataURL(this.files[0]);
})

// xss encoding on output: encode data so its safe to display on the webpage

const text = document.getElementById("query-input")
const btn = document.getElementById("btn")
const output = document.getElementById("query-output")

// replace all characters with their html entity equivalent
const encodeHTML = str => str.replace(/[\u00A0-\u9999<>\&]/gim, (i) => `&#${i.charCodeAt(0)};`);
function getInputValue() {
    output.innerHTML = encodeHTML(text.value)
    console.log(output.innerHTML)

    if (output.innerHTML.includes("&lt;")) {
        console.log("Test for " + "<" + " located and encoded. PASSED")
    } 
    if (output.innerHTML.includes("&gt;")) {
        console.log("Test for " + ">" + " located and encoded. PASSED")
    } 
}

// when click shows input
btn.addEventListener('click', getInputValue)

const form = document.getElementById("form-id")

form.addEventListener('submit', (e) => {
    e.preventDefault();
})