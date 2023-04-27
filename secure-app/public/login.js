const bcrypt = require('bcrypt');
const client = require('../databasepg');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) =>{
    const values = req.body;
    const entUsername = values.username;
    const entPassword = values.password;
    console.log(entUsername);
    console.log(entPassword);
    try{
        const data = await client.query(`SELECT * FROM accounts WHERE username = $1;`, [entUsername])
        const user = data.rows;
        if(user.length === 0){
            res.status(400).json({
                error: "User is not registered",
            });
        }else{
            bcrypt.compare(entPassword, user[0].password, (err, result) =>{
                console.log("hi");
                if(err){
                    res.status(500).json({
                        error: "Server error",
                    });
                } else if(result === true){
                    const token = jwt.sign({entUsername: entUsername}, "h5i3uh4yu5th");
                    
                    /*res.status(200).json({
                        message: "User signed in",
                        token: token,
                    });*/
                    res.redirect('/home.html');
                }else{
                    if(result != true)
                        res.status(400).json({
                        error: "Enter correct password!"
                        });
                }
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: "Database error occurred while signing in!",
        });
    };
};

