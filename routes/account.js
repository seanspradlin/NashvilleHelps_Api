const router = require('express').Router();
const utils = require('../lib/utils');
const winston = require('winston');
const ExpiryStore = require('../lib/expiry-store');
const models = require('../models');
const User = models.User;
const Agency = models.Agency;
const store = new ExpiryStore();

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

/**
 * @api {post}  /account/register  Create an account
 * @apiName Register
 * @apiGroup Account
 *
 * @apiParam  {String}  first_name  First Name
 * @apiParam  {String}  last_name   Last Name
 * @apiParam  {String}  token       Registration token
 * @apiParam  {String}  password    Password
 * @apiParam  {String}  [phone]     Phone number
 */
router.post('/register', (req, res) => {
  winston.debug('POST /account/register');
  const required = ['first_name', 'last_name', 'token', 'password'];
  if (!utils.checkProperties(required, req.body)) {
    res
      .status(422)
      .json({ error: `${required.join(',')} are required` });
  } else {
    const redeemed = store.redeem(req.body.token);
    if (redeemed) {
      User.findOne({ email: redeemed.email })
        .then(user => {
          if (user) return Promise.reject();
          const newUser = new User();
          newUser.name.first = req.body.first_name;
          newUser.name.last = req.body.last_name;
          newUser.email = redeemed.email;
          newUser.password = newUser.generateHash(req.body.password);
          newUser.phone = req.body.phone;
          newUser.agency = redeemed.agency_id;
          return newUser.save();
        })
        .then(user => {
          req.login(user, () => {
            res.json({
              _id: user._id,
              name: {
                first: user.name.first,
                last: user.name.last,
              },
              email: user.email,
              phone: user.phone,
              agency: user.agency,
            });
          });
        })
        .catch(error => {
          winston.error(error);
          res.status(500).end();
        });
    } else {
      res.status(400).json({ error: 'invalid token' });
    }
  }
});

/**
 * @api {post}  /account/login Login to an account
 * @apiName Login
 * @apiGroup Account
 *
 * @apiParam  {String}  email     Email
 * @apiParam  {String}  password  Password
 *
 * @apiSuccess  {ObjectId}  _id         Unique user ID
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first  First name
 * @apiSuccess  {String}    name.last   Last name
 * @apiSuccess  {String}    email       Email
 * @apiSuccess  {String}    phone       Phone number
 * @apiSuccess  {ObjectId}  agency      Unique ID of agency
 *
 * @apiUse UnauthorizedError
 * @apiUse UnprocessableEntityError
 */
router.post('/login', (req, res) => {
  winston.debug('POST /account/login');

  const required = ['email', 'password'];
  if (!utils.checkProperties(required, req.body)) {
    res
      .status(422)
      .json({ error: `${required.join(',')} are required` });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user.validPassword(req.body.password)) {
          res.status(401).end();
        } else {
          req.login(user, error => {
            if (error) {
              winston.error(error);
              res.status(500);
            } else {
              res.json({
                _id: user._id,
                name: {
                  first: user.name.first,
                  last: user.name.last,
                },
                email: user.email,
                phone: user.phone,
                agency: user.agency,
              });
            }
          });
        }
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {post}  /account/logout  Logout of an account
 * @apiName Logout
 * @apiGroup Account
 */
router.post('/logout', (req, res) => {
  winston.debug('POST /account/logout');
  req.logout();
  res.status(204).end();
});
module.exports = router;

