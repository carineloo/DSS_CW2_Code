const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const client = require('../databasepg');
const querystring = require('querystring');
const server = require('../app')
const CryptoJS = require('crypto-js');

require("dotenv").config();



exports.validateCPW = async (req, res) => {


  const cookieID = req.cookies.sessionID
  console.log("CookieID of secret = " + cookieID)
  const username = server.sessions[cookieID].user.username
  console.log("username is = " + username)
  const token = req.body.otp;
  client.query(`SELECT * FROM accounts WHERE username = $1`, [username], (err, result) =>{
    
    const specialRow = result.rows
    const secret = specialRow[0].special

    const bytes = CryptoJS.AES.decrypt(secret, process.env.ENCRYPTION_SECRET_KEY);
    const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);

    const validated = speakeasy.totp.verify({
        secret: decryptedSecret,
        encoding: 'base32',
        token: token
    })
    if(validated)
    {
        console.log("Validated!")
        const hash = server.sessions[cookieID].user.password
        client.query(`UPDATE accounts SET password = $2 WHERE username = $1`, [username, hash], function (e, results) {
        if (err) {
            console.log("Failed to update password " + e)
            return
        }
        
        console.log("Password change success.")
        res.redirect('/secureLogin.html');
        }) 
    }
    else{
      console.log("Not validated")
      const actualToken = speakeasy.totp({
        secret: decryptedSecret,
        encoding: "base32"
      });

      console.log(actualToken)
    }
  })
}

