const express = require('express');
const router = express.Router();
const {signup, login} = require('../controllers/auth.controller');
const rateLimit  = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:30,
    message:{message: "too many requests, please try again later"}})
router.post('/signup', signup);
router.post('/login', loginLimiter, login);

module.exports = router;