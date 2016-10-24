const router = require('express').Router();
const User = require('../models').User;
const utils = require('../lib/utils');
const winston = require('winston');
const ExpiryStore = require('../lib/expiry-store');
const store = new ExpiryStore();

/**
 * @api {post}  /auth/register  Create a account
 * @apiName PostAuthRegister
 * @apiGroup Auth
 *
 * @apiParam  {String}  first_name  First Name
 * @apiParam  {String}  last_name   Last Name
 * @apiParam  {String}  token       Registration token
 * @apiParam  {String}  password    Password
 * @apiParam  {String}  [phone]     Phone number
 */
router.post('/register', (req, res) => {
  winston.debug('POST /auth/register');
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
 * @api {post}  /auth/login Login to an account
 * @apiName PostAuthLocal
 * @apiGroup Auth
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
  winston.debug('POST /auth/login');
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
 * @api {post}  /auth/logout  Logout of an account
 * @apiName PostAuthLogout
 * @apiGroup Auth
 */
router.post('/logout', (req, res) => {
  winston.debug('POST /auth/logout');
  req.logout();
  res.status(204).end();
});

module.exports = router;

