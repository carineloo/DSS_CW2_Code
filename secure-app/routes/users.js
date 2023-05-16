const express = require('express');
const router = express.Router();


const{register} = require('../public/register');
const{secureLogin} = require('../public/secureLogin');
const{changePW} = require('../public/changePW');
const{verify} = require('../public/verify');
const{validate} = require('../public/validate');


// const{dashboard} = ssrequire('../public/dashboard');

router.post('/register', register);
router.post('/secureLogin', secureLogin);
router.post('/changePW', changePW);
router.post('/verify', verify);
router.post('/validate', validate)
// router.post('/dashboard', dashboard);


module.exports = router;