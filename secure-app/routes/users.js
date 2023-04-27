const express = require('express');
const router = express.Router();

const{register} = require('../public/register');
const{login} = require('../public/login');

router.post('/register', register);
router.post('/login', login);

module.exports = router;