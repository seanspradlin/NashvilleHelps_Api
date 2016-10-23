const router = require('express').Router();
const account = require('./account');
const agencies = require('./agencies');
const auth = require('./auth');
const users = require('./users');

router.use('/account', account);
router.use('/agencies', agencies);
router.use('/auth', auth);
router.use('/users', users);

module.exports = router;

