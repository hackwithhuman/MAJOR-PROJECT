const express = require('express');
const User = require('../models/userauth.js');
const passport = require('passport');
const req = require('express/lib/request.js');
const router = express.Router();
const userauthcontrollers = require('../Controllers/users.js');

// Sign-up 
router.get('/signup', userauthcontrollers.randerSignup);
router.post('/signup', userauthcontrollers.signup);

//Login 
router.get('/login', userauthcontrollers.randerLogin);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true}), userauthcontrollers.login);

//Log-out
router.get('/logout', userauthcontrollers.logOut);

module.exports = router;