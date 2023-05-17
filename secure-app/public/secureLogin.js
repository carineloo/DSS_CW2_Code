const bcrypt = require('bcrypt');
const client = require('../databasepg');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const http = require('http');
const server = require('../app')

exports.secureLogin = async (req, res) => {

    const values = req.body;
    const entUsername = values.username;
    const entEmail = values.email;
    const entPassword = values.password;

    /* 
        - keep track of request made per user, limiting user request made within a specific time period (rate limiting)
        - prevents brute force attacks by limiting number of requests the attacker can make
        - attacker will need to use many valid unique usernames to bypass the rate limit - difficult without access to these
    */
    const makeRequest = new Map()

    function userRequest(entUsername) {
        const timeNow = performance.now()
        const oldRequestTime = makeRequest.get(entUsername)

        // rate is number of requests per second
        if (oldRequestTime && timeNow - oldRequestTime < 1000) {
            setTimeout(() => {
                res.status(500).json({
                    error: "Too many requests. Please wait and try again in a moment."
                })
            }, 2000)
        }

        makeRequest.set(entUsername, timeNow)
        console.log("Making request..." + entUsername + " " + timeNow)
    }

    try {
        const data = await client.query(`SELECT * FROM accounts WHERE username = $1;`, [entUsername])
        const user = data.rows;

        userRequest(entUsername)

        // reject different type of username other than string (input validation)
        if (typeof entUsername != "string" || typeof entPassword != "string") {
            response.send("Invalid username parameters!")
            return
        }

        /* 
            - input validation
            - checks for special characters first, but proceeds with following for extra caution
        */

        // check if user is registered
        if (user.length === 0) {
            setTimeout(() => {
                res.status(400).json({
                    error: "Login Invalid!"
                })
            }, 2000)

            // check if username has special characters (XSS and SQL injection)
        } else {
            // check if token exists in database
            if (!user[0].token) {
                setTimeout(() => {
                    res.status(500).json({
                        error: "Database error. Cannot identify user."
                    })
                }, 2000)
            }

            bcrypt.compare(entPassword, user[0].password, (err, result) => {
                /*
                    - prevent SQL injection with parameterised query
                    - these are prepared statements define in the SQL
                    - allows the database to recognise SQL query from all user input
                    - meaning each placeholder reads all inputs merely as values
                    - if it is an illegal input or doesn't match the database, it will be false
                */
                if (entUsername && entPassword) {
                    console.log("Queries Examples:")
                    // select statement
                    client.query(`SELECT * FROM accounts`, function (error, results) {
                        if (error) {
                            console.log("1.0 - Select query " + error)
                            return
                        }
                        if (results = true) {
                            console.log("1.0 - Select query SUCCESS")
                        }
                    })
                    // select statement with username and password
                    client.query(`SELECT * FROM accounts WHERE username = $1 AND password = $2`, [entUsername, entPassword], function (error, results) {
                        if (error) {
                            console.log("1.1 - Select query username and password " + error)
                        } else if (results = true) {
                            console.log("1.1 - Select query username and password SUCCESS")
                        }
                    })
                    // insert statement
                    client.query(`INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3);`, [entUsername, entEmail, entPassword], function (error, results) {
                        if (error) {
                            console.log("2.0 - Insert query " + error)
                            return
                        }
                        if (results = true) {
                            console.log("2.0 - Insert query SUCCESS")
                        }
                    })
                    // update changing username
                    client.query(`UPDATE accounts SET username = $1 WHERE username = $1`, [entUsername], function (error, results) {
                        if (error) {
                            console.log("3.0 - Update query with username " + error)
                            return
                        }
                        if (results = true) {
                            console.log("3.0 - Update query with username SUCCESS")
                        }
                    })
                }
                if (err) {
                    res.status(500).json({
                        error: "Server error",
                    });
                } else if (result != true) {
                    // incorrect password message delayed
                    setTimeout(() => {
                        res.status(400).json({
                            error: "Login Invalid!"
                        })
                    }, 2000)

                } else if (result = true) { // success 
                    client.query(`SELECT * FROM accounts WHERE username = $1`, [entUsername], (err, result) => {
                        const resultRow = result.rows
                        const tokenRow = resultRow[0].token
                        console.log("Token is " + tokenRow);
                        const userData = {
                            username: entUsername,
                        }
                        server.createSession(tokenRow, userData)
                        res.cookie('sessionID', server.sessions[tokenRow].id)
                        console.log("Cookie: " + res.get('Set-Cookie'))

                        setTimeout(() => {
                            res.redirect('/validate.html');
                        }, 2000)
                    })
                }
            })
        }

    } catch (err) {
        console.log(err);
        setTimeout(() => {
            res.status(500).json({
                error: "Database error occurred while signing in!",
            });
        }, 2000)
    }
}

/*** (<--- paremeterised queries to prevent sql injection --->)
 query()` method is used to execute a SELECT statement with a placeholder for the `username` value. The placeholder is represented by a `?` character in the query string. An array containing the `newUsername` value is passed as the second argument to the `query()` method. It automatically escapes the username value to prevent SQL injection attacks.
***/
