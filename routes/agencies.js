const router = require('express').Router();
const Agency = require('../models').Agency;
const winston = require('winston');

/**
 * @api {get} /agencies Get all agencies
 * @apiName GetAgency
 * @apiGroup Agency
 *
 * @apiSuccess  {Agency[]}  agencies
 * @apiSuccess  {ObjectId}  agencies._id
 * @apiSuccess  {String}    agencies.name
 * @apiSuccess  {String}    agencies.address
 * @apiSuccess  {String}    agencies.phone
 *
 * @apiUse UnauthorizedError
 */
router.get('/', (req, res) => {
  winston.log('GET /agencies');
  if (req.isAuthenticated()) {
    Agency.find()
      .then(users => {
        res.json(users);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {get} /agencies/:agency_id Get a specific agency
 * @apiName GetSpecificAgency
 * @apiGroup Agency
 *
 * @apiSuccess  {ObjectId}  _id
 * @apiSuccess  {String}    name
 * @apiSuccess  {String}    address
 * @apiSuccess  {String}    phone
 *
 * @apiUse UnauthorizedError
 */

/**
 * @api {post} /agencies Create an agency
 * @apiName CreateAgency
 * @apiGroup Agency
 *
 * @apiParam  {String}  name
 * @apiParam  {String}  address
 * @apiParam  {String}  phone
 *
 * @apiSuccess  {ObjectId}  _id
 * @apiSuccess  {String}    name
 * @apiSuccess  {String}    address
 * @apiSuccess  {String}    phone
 *
 * @apiUse UnauthorizedError
 */

/**
 * @api {put} /agencies/:agency_id Update an agency
 * @apiName UpdateAgency
 * @apiGroup Agency
 *
 * @apiParam  {ObjectId}  agency_id
 * @apiParam  {String}    [name]
 * @apiParam  {String}    [address]
 * @apiParam  {String}    [phone]
 *
 * @apiUse UnauthorizedError
 */

/**
 * @api {delete} /agencies/:agency_id Delete an agency
 * @apiName DeleteAgency
 * @apiGroup Agency
 *
 * @apiParam  {ObjectId}  agency_id
 *
 * @apiUse UnauthorizedError
 */

