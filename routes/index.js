const router = require('express').Router();
const auth = require('./auth');
const agencies = require('./agencies');

router.use('/auth', auth);
router.use('/agencies', agencies);

module.exports = router;

