const qrcode = require('qrcode');
const speakeasy = require('speakeasy');



const secret = speakeasy.generateSecret({ length: 20 });

qrcode.toDataURL("img/qr.png", secret.otpauth_url, function(err){
  if (err) {
    return console.log('error occurred')
  }
});

QRCode.toDataURL('text', opts, function (err, url) {
  if (err) throw err

  var img = document.getElementById('image')
  img.src = url
})
function showQR()
{

  console.log("clicked")

};



  