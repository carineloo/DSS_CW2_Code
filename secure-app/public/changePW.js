const client = require('../databasepg');
const bcrypt = require('bcrypt');
const server = require('../app')

exports.changePW = async (req, res) => {

    const values = req.body;
    const username = values.username
    const oldPw = values.old_password
    const newPw = values.new_password
    const confirmPw = values.confirm_password

    console.log(username)
    console.log(confirmPw)

    try {
        const data = await client.query(`SELECT * FROM accounts WHERE username = $1;`, [username])
        const user = data.rows;

        if (user.length === 0) {
            setTimeout(() => {
                res.status(400).json({
                    error: "Change Invalid!"
                })
            }, 2000)

            // check if password entered and old registered password matches
            
        }
        bcrypt.compare(oldPw, user[0].password, (err, result) => {
            if (result && confirmPw === newPw) {
                // console.log("Same pass")
                bcrypt.hash(confirmPw, 10, (err, hash) => {

                    client.query(`SELECT * FROM accounts WHERE username = $1`, [username], (err, result) => {
                        const resultRow = result.rows
                        const tokenRow = resultRow[0].token
                        console.log("Token is " + tokenRow);
                        const userData = {
                            username: username,
                            password: hash,
                        }

                        server.createSession(tokenRow, userData)
                        res.cookie('sessionID', server.sessions[tokenRow].id)
                        console.log("Cookie: " + res.get('Set-Cookie'))

                        setTimeout(() => {
                            res.redirect('/validateCPW.html');
                        }, 2000)
                    })
                    
                })
            } else {
                console.log("Wrong pass")
            }
        })
    } catch (err) {
        console.log(err);
        setTimeout(() => {
            res.status(500).json({
                error: "Database error occurred while signing in!",
            });
        }, 2000)
    }
}