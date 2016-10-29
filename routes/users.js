const router = require('express').Router();
const User = require('../models').User;
const winston = require('winston');

/**
 * @api {get} /users Get all users
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess  {Object[]}  users
 * @apiSuccess  {Object}    users.name
 * @apiSuccess  {String}    users.name.first
 * @apiSuccess  {String}    users.name.last
 * @apiSuccess  {String}    users.email
 * @apiSuccess  {String}    users.phone
 * @apiSuccess  {String}    users.agency
 * @apiSuccess  {Boolean}   users.is_admin
 *
 * @apiUse UnauthorizedError
 */
router.get('/', (req, res) => {
  winston.debug('GET /users');

  if (req.isAuthenticated() && req.user.is_admin) {
    User.find()
      .then(users => {
        res.json(users.map(user => ({
          _id: user._id,
          agency: user.agency,
          email: user.email,
          phone: user.phone,
          is_admin: user.is_admin,
          name: user.name,
        })));
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {get} /users/:user_id Get a specific user
 * @apiName GetSpecificUser
 * @apiGroup User
 *
 * @apiSuccess  {Object}    users.name
 * @apiSuccess  {String}    users.name.first
 * @apiSuccess  {String}    users.name.last
 * @apiSuccess  {String}    users.email
 * @apiSuccess  {String}    users.phone
 * @apiSuccess  {String}    users.agency
 * @apiSuccess  {Boolean}   users.is_admin
 *
 * @apiUse UnauthorizedError
 */
router.get('/:user_id', (req, res) => {
  winston.debug(`GET /users/${req.params.user_id}`);

  if (req.isAuthenticated() && req.user.is_admin) {
    User.findById(req.params.user_id)
      .then(user => {
        res.json({
          _id: user._id,
          agency: user.agency,
          email: user.email,
          phone: user.phone,
          is_admin: user.is_admin,
          name: user.name,
        });
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {delete} /users/:user_id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam  {String}  user_id
 *
 * @apiUse UnauthorizedError
 */
router.delete('/:user_id', (req, res) => {
  winston.debug(`DELETE /users/${req.params.user_id}`);

  if (req.isAuthenticated() && req.user.is_admin) {
    User.findOneAndRemove({ _id: req.params.agency_id })
      .then(() => {
        res.end();
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else {
    res.status(401).end();
  }
});

module.exports = router;

