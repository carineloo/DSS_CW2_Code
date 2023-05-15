const express = require('express');
const router = express.Router();

const{register} = require('../public/register');
const{secureLogin} = require('../public/secureLogin');
const{changePW} = require('../public/changePW');

router.post('/register', register);
router.post('/secureLogin', secureLogin);
router.post('/changePW', changePW);

module.exports = router;