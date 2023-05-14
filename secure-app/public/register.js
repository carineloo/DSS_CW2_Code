const bcrypt = require('bcrypt');
const client = require('../databasepg');
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,10}$/;
    return pattern.test(password)
}

// accoum enum: generic error message, delay error message //
// add function to check password // 
// session hijacking: session time out //
// token for each user (extra?)
// SQL: parameterised query and input validation //
// sanitise emails: not case sensitive. keeping it all lowercase is best practice - decrease the chance of running into issues or causing confusion.
// rate limiting //
// login, direct to a page... to show use inputs //
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

    if (!newEmail || !newUsername || !newPassword) {
        // errors.push({ message: "Please enter all fields" });
        return res.status(400).json({
            error: "Please enter all fields.",
        });
    }

    else {
        try {
            const data = await client.query(`SELECT * FROM accounts WHERE email = $1`, [newEmail]);
            const arr = data.rows;
            if (arr.length != 0) {
                return res.status(400).json({
                    // check if taken
                    error: "Invalid Email.",
                });
            }
            else {
                if (checkEmail(newEmail)) {
                    // console.log("Valid email address");
                } else {
                    // console.log("Invalid email address");
                    return res.status(400).json({
                        error: "Invalid email address format.",
                    });
                }
                if (checkUsername(newUsername)) {
                    // console.log("Valid name");
                } else {
                    return res.status(400).json({
                        error: "Username should only have alphanumeric characters.",
                    });
                }
                if (checkPassword(newPassword)) {
                    // console.log("Valid name");
                } else {
                    return res.status(400).json({
                        error: "Password should have 8 - 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
                    });
                }

                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err)
                        res.status(err).json({
                            error: "Server error",
                        });
                    console.log(hash);

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
                            return res.status(500).json({
                                // check if taken
                                error: "Database Error. Username Invalid."
                            })
                        }
                        else {
                            flag = 1;
                            //res.status(200).send({message: 'User added to database, not verified'});
                            res.redirect('/secureLogin.html');
                        }
                    })

                    if (flag) {
                        console.log("Token created.");
                    }
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Database error while registring user!",
            });
        };
    }
}
