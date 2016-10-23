const router = require('express').Router();
const User = require('../models').User;
const utils = require('../lib/utils');
const winston = require('winston');

/**
 * @api {get} /auth Get current user profile
 * @apiName GetAuth
 * @apiGroup Auth
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
 */
router.get('/', (req, res) => {
  winston.debug('GET /auth');
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      name: {
        first: req.user.name.first,
        last: req.user.name.last,
      },
      email: req.user.email,
      phone: req.user.phone,
      agency: req.user.agency,
    });
  } else res.status(401).end();
});

/**
 * @api {post}  /auth/register  Create a account
 * @apiName PostAuthRegister
 * @apiGroup Auth
 *
 * @apiParam  {String}  firstName First Name
 * @apiParam  {String}  lastName  Last Name
 * @apiParam  {String}  email     Email
 * @apiParam  {String}  password  Password
 * @apiParam  {String}  key       Registration key
 * @apiParam  {String}  [phone]   Phone number
 */
router.post('/register', (req, res) => {
  winston.debug('POST /auth/register');
  const required = ['firstName', 'lastName', 'email', 'password', 'key'];
  if (!utils.checkProperties(required, req.body)) {
    res
      .json({ error: `${required.join(',')} are required` })
      .status(422)
      .end();
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) return Promise.reject();
        const newUser = new User();
        newUser.name.first = req.body.firstName;
        newUser.name.last = req.body.lastName;
        newUser.email = req.body.email;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.phone = req.body.phone;
        return newUser.save();
      })
      .then(user => {
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
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
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
      .json({ error: `${required.join(',')} are required` })
      .status(422)
      .end();
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

