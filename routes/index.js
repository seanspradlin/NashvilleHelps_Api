const router = require('express').Router();
const account = require('./account');
const agencies = require('./agencies');
const services = require('./services');
const users = require('./users');

router.use('/account', account);
router.use('/agencies', agencies);
router.use('/services', services);
router.use('/users', users);

module.exports = router;

