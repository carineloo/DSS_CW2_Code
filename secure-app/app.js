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

client.connect((err) => { // Connected Database

    if (err) {
        console.log(err);
    } else {
        console.log("Data logging initiated!");
    }
});

/* 
    - prevent attacks such as DDoS, by limitting no. of requests that can be made from one IP address within a time period.
    - rate limiting prevents overwhelimg the web server with large no. of requests, potentially crashing it 
    - once it reaches the rate limit, the attacker can't make anymore requests, and the rate limit resets
*/
const rateLimit = require("express-rate-limit");
// middleware to limit the number of requests from each IP address

const limiter = rateLimit({
    // up to 100 requests every 15 minutes for each ip address
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Request limit has reached, please try again.'
});

// rate limiting applied to all the routes
app.use(limiter);

// file incursion
// intrusion detection system


// const net = require('net');

// // Define the port to listen on

// // Create a server
// const server = net((socket) => {
//   console.log('Client connected');

//   // Handle incoming data
//   socket.on('data', (data) => {
//     console.log(`Received data: ${data}`);

//     // Check for signs of an attack
//     if (data.includes('DROP TABLE')) {
//       console.log('Possible SQL injection detected!');
//     }
//   });

//   // Handle disconnects
//   socket.on('end', () => {
//     console.log('Client disconnected');
//   });
// });


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
