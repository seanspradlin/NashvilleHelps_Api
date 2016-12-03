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
 * @apiParam    {String}    user_id
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
 * @api {put} /users/:user_id Update a user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam  {String}  user_id
 * @apiParam  {String}  [first_name]
 * @apiParam  {String}  [last_name]
 * @apiParam  {String}  [email]
 * @apiParam  {String}  [phone]
 * @apiParam  {String}  [agency]
 * @apiParam  {Boolean} [is_admin]
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
router.put('/:user_id', (req, res) => {
  winston.debug(`PUT /users/${req.params.user_id}`);

  if (!req.isAuthenticated() || !req.user.is_admin) {
    res.status(401).end();
  } else {
    User.findById(req.params.user_id)
      .then(user => {
        if (req.body.first_name) user.name.first = req.body.first_name;
        if (req.body.last_name) user.name.last = req.body.last_name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.agency) user.agency = req.body.agency;
        if (req.body.is_admin) {
          user.is_admin = typeof req.body.is_admin === 'boolean'
                        ? req.body.is_admin
                        : req.body.is_admin === 'true';
        }
        return user.save();
      })
      .then(user => {
        res.json(user);
      })
      .catch(() => {
        res
          .status(400)
          .json({ error: 'bad request' });
      });
  }
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

