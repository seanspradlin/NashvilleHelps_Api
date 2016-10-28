const router = require('express').Router();
const models = require('../models');
const Client = models.Client;
const Service = models.Service;
const utils = require('../lib/utils');
const winston = require('winston');

/**
 * @api {get} /clients Get all clients
 * @apiName GetClients
 * @apiGroup Client
 *
 * @apiParam  {Boolean}   [is_fulfilled]
 * @apiParam  {String}    [email]
 * @apiParam  {String[]}  [services]
 *
 * @apiSuccess  {Object[]}  clients
 * @apiSuccess  {Object}    clients.name
 * @apiSuccess  {String}    clients.name.first
 * @apiSuccess  {String}    clients.name.last
 * @apiSuccess  {String}    clients.email
 * @apiSuccess  {Object}    clients.address
 * @apiSuccess  {String}    clients.address.street1
 * @apiSuccess  {String}    clients.address.street2
 * @apiSuccess  {String}    clients.address.city
 * @apiSuccess  {String}    clients.address.state
 * @apiSuccess  {String}    clients.address.postal
 * @apiSuccess  {String}    clients.phone
 * @apiSuccess  {String}    clients.assistant
 * @apiSuccess  {Object[]}  clients.referrals
 * @apiSuccess  {Boolean}   clients.referrals.isComplete
 * @apiSuccess  {String}    clients.referrals.agency
 * @apiSuccess  {Date}      clients.referrals.requested
 * @apiSuccess  {String}    clients.referrals.service
 * @apiSuccess  {String}    clients.referrals.service_name
 *
 * @apiUse UnauthorizedError
 */
router.get('/', (req, res) => {
  winston.debug('GET /clients');

  if (!req.isAuthenticated()) {
    res.status(401).end();
  } else {
    const options = {};
    if (req.params.is_fulfilled) {
      options.isFulfilled = req.params.is_fulfilled;
    }

    if (req.params.email) {
      options.email = req.params.email;
    }

    if (req.params.services) {
      const serviceArray = req.params.services.split(',');
      options.referrals = {
        $exists: {
          service: {
            $in: serviceArray,
          },
          isComplete: false,
        },
      };
    }

    Client.find(options)
      .then(clients => {
        res.json(clients);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {get} /clients/:client_id Get a specific client
 * @apiName GetSpecificClient
 * @apiGroup Client
 *
 * @apiParam  {String}  client_id
 *
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first
 * @apiSuccess  {String}    name.last
 * @apiSuccess  {String}    email
 * @apiSuccess  {Object}    address
 * @apiSuccess  {String}    address.street1
 * @apiSuccess  {String}    address.street2
 * @apiSuccess  {String}    address.city
 * @apiSuccess  {String}    address.state
 * @apiSuccess  {String}    address.postal
 * @apiSuccess  {String}    phone
 * @apiSuccess  {String}    assistant
 * @apiSuccess  {Object[]}  referrals
 * @apiSuccess  {Boolean}   referrals.isComplete
 * @apiSuccess  {String}    referrals.agency
 * @apiSuccess  {Date}      referrals.requested
 * @apiSuccess  {String}    referrals.service
 * @apiSuccess  {String}    referrals.service_name
 *
 * @apiUse UnauthorizedError
 */
router.get('/:client_id', (req, res) => {
  winston.debug(`GET /clients/${req.params.client_id}`);

  if (!req.isAuthenticated()) {
    res.status(401).end();
  } else {
    Client.findById(req.params.client_id)
      .then(client => {
        res.json(client);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {post} /clients Create a client
 * @apiName CreateClient
 * @apiGroup Client
 *
 * @apiParam  {String}    first_name
 * @apiParam  {String}    last_name
 * @apiParam  {String}    email
 * @apiParam  {String}    street1
 * @apiParam  {String}    street2
 * @apiParam  {String}    city
 * @apiParam  {String}    state
 * @apiParam  {String}    postal
 * @apiParam  {String}    phone
 * @apiParam  {String}    assistant
 * @apiParam  {String[]}  services
 *
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first
 * @apiSuccess  {String}    name.last
 * @apiSuccess  {String}    email
 * @apiSuccess  {Object}    address
 * @apiSuccess  {String}    address.street1
 * @apiSuccess  {String}    address.street2
 * @apiSuccess  {String}    address.city
 * @apiSuccess  {String}    address.state
 * @apiSuccess  {String}    address.postal
 * @apiSuccess  {String}    phone
 * @apiSuccess  {String}    assistant
 * @apiSuccess  {Object[]}  referrals
 * @apiSuccess  {Boolean}   referrals.isComplete
 * @apiSuccess  {String}    referrals.agency
 * @apiSuccess  {Date}      referrals.requested
 * @apiSuccess  {String}    referrals.service
 * @apiSuccess  {String}    referrals.service_name
 */
router.post('/', (req, res) => {
  winston.debug('POST /clients');

  const required = [
    'first_name',
    'last_name',
    'phone',
    'services',
  ];

  if (!utils.checkProperties(required, req.body)) {
    res
      .status(422)
      .json({ error: `${required.join(',')} are required` });
  } else {
    const client = new Client({
      name: {
        first: req.body.first_name,
        last: req.body.last_name,
      },
      email: req.body.email,
      address: {
        street1: req.body.street1,
        street2: req.body.street2,
        city: req.body.city,
        state: req.body.state,
        postal: req.body.postal,
      },
      phone: req.body.phone,
      assistant: req.body.assistant,
    });

    let serviceArray;
    if (typeof req.body.services === 'string') {
      serviceArray = req.body.services.split(',');
    } else {
      serviceArray = req.body.services;
    }

    Service.find({
      _id: { $in: serviceArray },
    })
      .then(services => {
        if (!services[0]) {
          res
            .status(400)
            .json({ error: 'No service found' });
        } else {
          const currentTime = new Date();
          client.referrals = [];
          services.forEach(s => {
            client.referrals.push({
              requested: currentTime,
              service: s._id,
              service_name: s.name,
            });
          });

          client.save()
            .then(c => {
              res.json(c);
            })
            .catch(error => {
              winston.error(error);
              res.status(500).end();
            });
        }
      });
  }
});

/**
 * @api {put} /clients/:client_id Update a client
 * @apiName UpdateClient
 * @apiGroup Client
 *
 * @apiParam  {String}    client_id
 * @apiParam  {String}    first_name
 * @apiParam  {String}    last_name
 * @apiParam  {String}    email
 * @apiParam  {String}    street1
 * @apiParam  {String}    street2
 * @apiParam  {String}    city
 * @apiParam  {String}    state
 * @apiParam  {String}    postal
 * @apiParam  {String}    phone
 * @apiParam  {String}    assistant
 *
 * @apiSuccess  {Object}    name
 * @apiSuccess  {String}    name.first
 * @apiSuccess  {String}    name.last
 * @apiSuccess  {String}    email
 * @apiSuccess  {Object}    address
 * @apiSuccess  {String}    address.street1
 * @apiSuccess  {String}    address.street2
 * @apiSuccess  {String}    address.city
 * @apiSuccess  {String}    address.state
 * @apiSuccess  {String}    address.postal
 * @apiSuccess  {String}    phone
 * @apiSuccess  {String}    assistant
 * @apiSuccess  {Object[]}  referrals
 * @apiSuccess  {Boolean}   referrals.isComplete
 * @apiSuccess  {Date}      referrals.requested
 * @apiSuccess  {String}    referrals.service
 *
 * @apiUse UnauthorizedError
 */
router.put('/:client_id', (req, res) => {
  winston.debug(`PUT /clients/${req.params.client_id}`);

  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(401).end();
  } else {
    const properties = {
      name: {
        first: req.body.first_name,
        last: req.body.last_name,
      },
      email: req.body.email,
      address: {
        street1: req.body.street1,
        street2: req.body.street2,
        city: req.body.city,
        state: req.body.state,
        postal: req.body.postal,
      },
      phone: req.body.phone,
      assistant: req.body.assistant,
    };
    Client.update({ _id: req.params.client_id }, properties)
      .then(client => {
        res.json(client);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {post} /clients/:client_id/service/:service_id Complete a referral
 * @apiName CompleteClientReferral
 * @apiGroup Client
 *
 * @apiParam  {String}  client_id
 * @apiParam  {String}  service_id
 *
 * @apiUse UnauthorizedError
 */
router.post('/:client_id/service/:service_id', (req, res) => {
  winston.debug(`POST /clients/${req.params.client_id}/service/${req.params.service_id}`);

  if (!req.isAuthenticated()) {
    res.status(401).end();
  } else {
    Client.findById(req.params.client_id)
      .then(client => {
        let isFulfilled = true;
        client.referrals.forEach((r, i) => {
          if (r.service.toString() === req.params.service_id) {
            client.referrals[i].isComplete = true;
            client.referrals[i].agency = req.user.agency;
          }

          if (!client.referrals[i].isComplete) {
            isFulfilled = false;
          }
        });
        client.isFulfilled = isFulfilled;
        return client.save();
      })
      .then(() => {
        res.status(204).end();
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {delete} /clients/:client_id Delete a client
 * @apiName DeleteClient
 * @apiGroup Client
 *
 * @apiParam {String} client_id
 */
router.delete('/:client_id', (req, res) => {
  winston.debug(`DELETE /clients/${req.params.client_id}`);

  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(401).end();
  } else {
    Client.findOneAndRemove({ _id: req.params.client_id })
      .then(() => {
        res.status(204).end();
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

module.exports = router;

