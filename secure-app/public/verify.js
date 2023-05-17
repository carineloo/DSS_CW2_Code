const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const client = require('../databasepg');
const querystring = require('querystring');
const server = require('../app')
const CryptoJS = require('crypto-js');

require("dotenv").config();



exports.verify = async (req, res) => {


  
  
  const user = client.query(`SELECT token FROM accounts WHERE user_id=11`)
  secret2fa = req.app.get('secret2fa')

  token = req.body.otp;
  console.log("OTP " + token)

  const actualToken = speakeasy.totp({
    secret: secret2fa,
    encoding: "base32"
  });

  console.log(actualToken)


  const verified = speakeasy.totp.verify({
      secret: secret2fa,
      encoding: 'base32',
      token: token,
      window: 2
  })
  if(verified)
  {
    const cookieID = req.cookies.sessionID
    console.log("Verified!")
    const cipherSpecial = CryptoJS.AES.encrypt(secret2fa, process.env.ENCRYPTION_SECRET_KEY).toString();
    console.log("Encrypted secret" + cipherSpecial)
    client.query(`UPDATE accounts 
                  SET special = $1
                  WHERE token = $2;`, [cipherSpecial, cookieID], (err) => {
      
      res.redirect('/secureLogin.html');
      
    })
  }
  else{
    console.log("Not verified")
  }
    
}


