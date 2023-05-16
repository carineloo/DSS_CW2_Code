const bcrypt = require('bcrypt');
const client = require('../databasepg');
const jwt = require("jsonwebtoken");
const session = require('express-session');
require("dotenv").config();
const server = require('../app')

/** xss **/

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

// validates password only allow alphanumeric 
function checkPassword(password) {
    const pattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,16}$/g;
    return pattern.test(password)
}

// accoum enum: generic error message, delay error message //
// add function to check password // 
// session hijacking: session time out //
// SQL: parameterised query and input validation //
// sanitise emails: not case sensitive. keeping it all lowercase is best practice - decrease the chance of running into issues or causing confusion. modifies input to ensure a valid format before inserting to database.
// login, redirect to a secureLogin... to show user inputs //
// rate limiting //
// token for each user (extra?) check if token exists in db
// https for MITM attack //

/** xss **/

exports.register = async (req, res) => {

    const values = req.body;
    const newEmail = values.email;
    const newUsername = values.username;
    const newPassword = values.password;

    // console.log(newEmail);
    // console.log(newUsername);
    // console.log(newPassword);

    try {
        const data = await client.query(`SELECT * FROM accounts WHERE email = $1`, [newEmail]);
        const arr = data.rows;
        if (arr.length != 0) {
            setTimeout(() => {
                res.status(400).json({
                    error: "Invalid Register."
                })
            }, 2000)
        }
        else {
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err)
                    setTimeout(() => {
                        res.status(err).json({
                            error: "Server error"
                        })
                    }, 2000)

                // put to lower case prevent confusion
                const sanitisedEmail = newEmail.toLowerCase()

                const user = {
                    newUsername,
                    newEmail: sanitisedEmail,
                    newPassword: hash
                };

                var flag = 1; // checks is user has registered

                // make token
                const token = jwt.sign({ username: user.newUsername, expiresIn: 60 * 1 }, process.env.SECRET_KEY);

                client.query(`INSERT INTO accounts (username, email, password, token) VALUES ($1, $2, $3, $4);`, [user.newUsername, user.newEmail, user.newPassword, token], (err) => {
                    if (err) {
                        flag = 0;
                        console.error(err);
                        setTimeout(() => {
                            res.status(err).json({
                                // check if taken
                                error: "Database Error. Username Invalid."
                            })
                        }, 2000)
                    }
                    else { // success
                        flag = 1;
                        //res.status(200).send({message: 'User added to database, not verified'})

                        const userData = {
                            username: user.newUsername,
                        }
    
                        server.createSession(token, userData)
                        res.cookie('sessionID', server.sessions[token].id)
                        console.log("Cookie: " + res.get('Set-Cookie'))
                        res.redirect('/verify.html');
                    }
                })
            })
        }
    }
    catch (err) {
        console.log(err);
        setTimeout(() => {
            res.status(500).json({
                error: "Database error occurred while signing in!",
            });
        }, 2000)
    }
}
