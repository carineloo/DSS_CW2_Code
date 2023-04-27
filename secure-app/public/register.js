const bcrypt = require('bcrypt');
const client = require('../databasepg');
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.register = async (req, res) =>{
    const values = req.body;
    const newEmail = values.email;
    const newUsername = values.username;
    const newPassword = values.password;
    console.log(newEmail);
    console.log(newUsername);
    console.log(newPassword);
    if (!newEmail || !newUsername || !newPassword) {
        errors.push({ message: "Please enter all fields" });
    }
    else{
        try{
            const data = await client.query(`SELECT * FROM accounts WHERE email = $1`, [newEmail]);
            const arr = data.rows;
            if(arr.length != 0){
                return res.status(400).json({
                    error:"Email already there, no need to register again.",
                });
            }
            else{
                bcrypt.hash(newPassword,10,(err, hash) => {
                    if(err)
                    res.status(err).json({
                        error: "Server error",
                    });
                    console.log(hash);
                    const user = {
                        newUsername,
                        newPassword: hash,
                        newEmail,
                    };
                    var flag = 1;

                    client.query(`INSERT INTO accounts (username, password, email) VALUES ($1, $2, $3);`, [user.newUsername, user.newPassword, user.newEmail], (err)=>{
                        if(err){
                            flag = 0;
                            console.error(err);
                            return res.status(500).json({
                                error: "Database error"
                            })
                        }
                        else{
                            flag = 1;
                            //res.status(200).send({message: 'User added to database, not verified'});
                            res.redirect('/login.html');
                        }
                    })
                    if(flag){
                        const token = jwt.sign({username: user.newUsername},"h5i3uh4yu5th");
                        console.log(token);
                    };
                });
            }
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json({
                error: "Database error while registring user!",
            });
        };
    }    
}