const router = require('express').Router();
const Agency = require('../models').Agency;
const winston = require('winston');

/**
 * @api {get} /account Get current account
 * @apiName GetAccount
 * @apiGroup Account
 *
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first
 * @apiSuccess  {String}    name.last
 * @apiSuccess  {String}    email
 * @apiSuccess  {String}    phone
 * @apiSuccess  {Object}    agency
 * @apiSuccess  {String}    agency.name
 * @apiSuccess  {Object}    agency.address
 * @apiSuccess  {String}    agency.address.street1
 * @apiSuccess  {String}    agency.address.street2
 * @apiSuccess  {String}    agency.address.city
 * @apiSuccess  {String}    agency.address.state
 * @apiSuccess  {String}    agency.address.postal
 * @apiSuccess  {String}    agency.phone
 * @apiSuccess  {Boolean}   isAdmin
 *
 * @apiUse UnauthorizedError
 */
router.get('/', (req, res) => {
  winston.debug('GET /account');

  if (req.isAuthenticated()) {
    Agency.findById(req.user.agency)
      .then(agency => {
        res.json({
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          agency: {
            name: agency.name,
            address: agency.address,
            phone: agency.phone,
          },
          isAdmin: req.user.isAdmin,
        });
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {post} /account Update account information
 * @apiName UpdateAccount
 * @apiGroup Account
 *
 * @apiParam  {String}  [first_name]
 * @apiParam  {String}  [last_name]
 * @apiParam  {String}  [email]
 * @apiParam  {String}  [phone]
 *
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first
 * @apiSuccess  {String}    name.last
 * @apiSuccess  {String}    email
 * @apiSuccess  {String}    phone
 *
 * @apiUse UnauthorizedError
 */
router.post('/', (req, res) => {
  winston.debug('POST /account');

  if (req.isAuthenticated()) {
    winston.debug(req.body);
    if (req.body.first_name) req.user.name.first = req.body.first_name;
    if (req.body.last_name) req.user.name.last = req.body.last_name;
    if (req.body.email) req.user.email = req.body.email;
    if (req.body.phone) req.user.phone = req.body.phone;
    req.user.save()
      .then(user => {
        res.json({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {post} /account/password Change a password
 * @apiName ChangePassword
 * @apiGroup Account
 *
 * @apiParam  {String}  password
 *
 * @apiUse UnauthorizedError
 */
router.post('/password', (req, res) => {
  winston.debug('POST /account/password');

  if (req.isAuthenticated()) {
    if (req.body.password) {
      req.user.password = req.user.generateHash(req.body.password);
      req.user.save()
        .then(() => {
          res.status(200).end();
        })
        .catch(error => {
          winston.error(error);
          res.status(500).end();
        });
    } else {
      res
        .status(422)
        .json({ error: 'password required' });
    }
  } else res.status(401).end();
});

module.exports = router;

