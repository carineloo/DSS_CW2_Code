const express = require('express');
const router = express.Router();

const{register} = require('../public/register');
const{secureLogin} = require('../public/secureLogin');
// const{dashboard} = require('../public/dashboard');

router.post('/register', register);
router.post('/secureLogin', secureLogin);
// router.post('/dashboard', dashboard);

module.exports = router;