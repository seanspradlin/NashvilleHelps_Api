const router = require('express').Router();
const Agency = require('../models').Agency;
const utils = require('../lib/utils');
const winston = require('winston');

/**
 * @api {get} /agencies Get all agencies
 * @apiName GetAgency
 * @apiGroup Agency
 *
 * @apiSuccess  {Object[]}  agencies
 * @apiSuccess  {String}    agencies._id
 * @apiSuccess  {String}    agencies.name
 * @apiSuccess  {Object}    agencies.address
 * @apiSuccess  {String}    agencies.address.street1
 * @apiSuccess  {String}    agencies.address.street2
 * @apiSuccess  {String}    agencies.address.city
 * @apiSuccess  {String}    agencies.address.state
 * @apiSuccess  {String}    agencies.address.postal
 * @apiSuccess  {String}    agencies.phone
 *
 * @apiUse UnauthorizedError
 */
router.get('/', (req, res) => {
  winston.debug('GET /agencies');

  if (req.isAuthenticated() && req.user.isAdmin) {
    Agency.find()
      .then(agency => {
        res.json(agency);
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
 * @apiSuccess  {String}  _id
 * @apiSuccess  {String}  name
 * @apiSuccess  {Object}  address
 * @apiSuccess  {String}  address.street1
 * @apiSuccess  {String}  address.street2
 * @apiSuccess  {String}  address.city
 * @apiSuccess  {String}  address.state
 * @apiSuccess  {String}  address.postal
 * @apiSuccess  {String}  phone
 *
 * @apiUse UnauthorizedError
 */
router.get('/:agency_id', (req, res) => {
  winston.debug(`GET /agencies/${req.params.agency_id}`);

  if (req.isAuthenticated() && req.user.isAdmin) {
    Agency.findById(req.params.agency_id)
      .then(agency => {
        res.json(agency);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  } else res.status(401).end();
});

/**
 * @api {post} /agencies Create an agency
 * @apiName CreateAgency
 * @apiGroup Agency
 *
 * @apiParam  {String}  name
 * @apiParam  {String}  street1
 * @apiParam  {String}  street2
 * @apiParam  {String}  city
 * @apiParam  {String}  state
 * @apiParma  {String}  postal
 * @apiParam  {String}  phone
 *
 * @apiSuccess  {String}  _id
 * @apiSuccess  {String}  name
 * @apiSuccess  {Object}  address
 * @apiSuccess  {String}  address.street1
 * @apiSuccess  {String}  address.street2
 * @apiSuccess  {String}  address.city
 * @apiSuccess  {String}  address.state
 * @apiSuccess  {String}  address.postal
 * @apiSuccess  {String}  phone
 *
 * @apiUse UnauthorizedError
 */
router.post('/', (req, res) => {
  winston.debug('POST /agencies');

  const required = ['name', 'phone'];
  if (req.isAuthenticated() && req.user.isAdmin) {
    if (!utils.checkProperties(required, req.body)) {
      res
        .status(422)
        .json({ error: `${required.join(',')} are required` });
    } else {
      const agency = new Agency({
        name: req.body.name,
        address: {
          street1: req.body.street1,
          street2: req.body.street2,
          city: req.body.city,
          state: req.body.state,
          postal: req.body.postal,
        },
        phone: req.body.phone,
      });
      agency.save()
        .then(a => {
          res.json(a);
        })
        .catch(error => {
          winston.error(error);
          res.status(500).end();
        });
    }
  }
});

/**
 * @api {put} /agencies/:agency_id Update an agency
 * @apiName UpdateAgency
 * @apiGroup Agency
 *
 * @apiParam  {String}  agency_id
 * @apiParam  {String}  [name]
 * @apiParam  {String}  [street1]
 * @apiParam  {String}  [street2]
 * @apiParam  {String}  [city]
 * @apiParam  {String}  [state]
 * @apiParma  {String}  [postal]
 * @apiParam  {String}  [phone]
 *
 * @apiUse UnauthorizedError
 */
router.put('/:agency_id', (req, res) => {
  winston.debug(`PUT /agencies/${req.params.agency_id}`);

  if (req.isAuthenticated() && req.user.isAdmin) {
    Agency.findById(req.params.agency_id)
      .then(agency => {
        agency.name = req.body.name || agency.name;
        agency.address.street1 = req.body.street1 || agency.address.street1;
        agency.address.street2 = req.body.street2 || agency.address.street2;
        agency.address.city = req.body.city || agency.address.city;
        agency.address.state = req.body.state || agency.address.state;
        agency.address.postal = req.body.postal || agency.address.postal;
        agency.phone = req.body.phone || agency.phone;
        return agency.save();
      })
      .then(agency => {
        res.json(agency);
      })
      .catch(() => {
        res
          .status(400)
          .json({ error: 'bad request' });
      });
  } else {
    res.status(401).end();
  }
});

/**
 * @api {delete} /agencies/:agency_id Delete an agency
 * @apiName DeleteAgency
 * @apiGroup Agency
 *
 * @apiParam  {String}  agency_id
 *
 * @apiUse UnauthorizedError
 */
router.delete('/:agency_id', (req, res) => {
  winston.debug(`DELETE /agencies/${req.params.agency_id}`);

  if (req.isAuthenticated() && req.user.isAdmin) {
    Agency.findOneAndRemove({ _id: req.params.agency_id })
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
