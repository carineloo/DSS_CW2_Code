const client = require('../databasepg');
const bcrypt = require('bcrypt');

exports.changePW = async (req, res) => {

    const values = req.body;
    const username = values.username
    const oldPw = values.old_password
    const newPw = values.new_password
    const confirmPw = values.confirm_password

    console.log(username)
    console.log(confirmPw)

    if (!username || !oldPw || !newPw || !confirmPw) {
        setTimeout(() => {
            res.status(400).json({
                error: "Please enter all fields.",
            })
        }, 2000)
    }

    try {
        const data = await client.query(`SELECT * FROM accounts WHERE username = $1;`, [username])
        const user = data.rows;

        // check if password entered and old registered password matches
        const verified = bcrypt.compare(oldPw, user[0].password)
        if (verified) {
            // check if new pw is same as old
            if (confirmPw === oldPw) {
                setTimeout(() => {
                    res.status(400).json({
                        error: "New password cannot be the same as old password."
                    })
                }, 2000)
            }
            // check if confirm password is the same
            else if (confirmPw === newPw) {
                bcrypt.hash(confirmPw, 10, (err, hash) => {
                    // update changing password
                    client.query(`UPDATE accounts SET password = $2 WHERE username = $1`, [username, hash], function (e, results) {
                        if (err) {
                            console.log("Failed to update password " + e)
                            return
                        }
                    })
                    console.log("Password change success.")
                    res.redirect('/dashboard.html');
                })
            }
            else {
                setTimeout(() => {
                    res.status(400).json({
                        error: "New passwords don't match."
                    })
                }, 2000)
            }
        } else {
            setTimeout(() => {
                res.status(400).json({
                    error: "Old password incorrect."
                })
            }, 2000)
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