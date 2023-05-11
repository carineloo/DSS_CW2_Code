const client = require('./databasepg.js');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const user = require("./routes/users");

require("dotenv").config();

const routes = require('./routes/routes.js');

const PORT = 3003

// create express app
const app = express();
app.use(express.json())

// setup middlewares route
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const myHeaders = new Headers(); // Currently empty
myHeaders.set("Content-Type", "text/html");
myHeaders.set("X-Content-Type-Options", "nosniff"); // follow content-type header and should not be changed

client.connect((err) => { // Connected Database

    if (err) {
        console.log(err);
    } else {
        console.log("Data logging initiated!");
    }
});

app.get('/users', (req, res) => {
    client.query(`SELECT * FROM accounts`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})


app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', user);

app.listen(PORT, () => console.log("Server is now listening at PORT " + PORT));
