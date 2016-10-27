const router = require('express').Router();
const models = require('../models');
const Service = models.Service;
const winston = require('winston');
const utils = require('../lib/utils');

/**
 * @api {get} /services Get all services
 * @apiName GetServices
 * @apiGroup Service
 *
 * @apiParam  {String}  [category]
 * @apiParam  {String}  [name]
 *
 * @apiSuccess  {Object[]}  services
 * @apiSuccess  {String}    services._id
 * @apiSuccess  {String}    services.name
 * @apiSuccess  {String}    services.category
 */
router.get('/', (req, res) => {
  winston.debug('GET /services');
  const options = {};
  if (req.query.name) options.name = req.query.name;
  if (req.query.category) options.category = req.query.category;
  Service.find(options)
    .then(services => {
      res.json(services);
    })
    .catch(error => {
      winston.error(error);
      res.status(500).end();
    });
});

/**
 * @api {get} /services/:service_id Get a specific service
 * @apiName GetSpecificService
 * @apiGroup Service
 *
 * @apiParam  {String}  service_id
 *
 * @apiSuccess  {String}    _id
 * @apiSuccess  {String}    name
 * @apiSuccess  {String}    category
 */
router.get('/:service_id', (req, res) => {
  winston.debug(`GET /services/${req.params.service_id}`);

  Service.findById(req.params.service_id)
    .then(service => {
      res.json(service);
    })
    .catch(error => {
      winston.error(error);
      res.status(500).end();
    });
});

/**
 * @api {post} /services Create a service
 * @apiName CreateService
 * @apiGroup Service
 *
 * @apiParam  {String}  name
 * @apiParam  {String}  category
 *
 * @apiSuccess  {String}    _id
 * @apiSuccess  {String}    name
 * @apiSuccess  {String}    category
 *
 * @apiUse UnauthorizedError
 */
router.post('/', (req, res) => {
  winston.debug('POST /services');

  const required = ['name', 'category'];
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(401).end();
  } else if (!utils.checkProperties(required, req.body)) {
    res.status(422)
       .json({ error: `${required.join(',')} are required` });
  } else {
    const service = new Service(req.body);
    service.save()
      .then(a => {
        res.json(a);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {put} /services/:service_id Update a service
 * @apiName UpdateService
 * @apiGroup Service
 *
 * @apiParam  {String}  service_id
 * @apiParam  {String}  [name]
 * @apiParam  {String}  [category]
 *
 * @apiSuccess  {String}    _id
 * @apiSuccess  {String}    name
 * @apiSuccess  {String}    category
 *
 * @apiUse UnauthorizedError
 */
router.put('/:service_id', (req, res) => {
  winston.debug(`PUT /services/${req.params.service_id}`);

  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(401).end();
  } else {
    Service.findById(req.params.service_id)
      .then(service => {
        service.name = req.body.name || service.name;
        service.category = req.body.category || service.category;
        return service.save();
      })
      .then(service => {
        res.json(service);
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

/**
 * @api {delete} /services/:service_id Delete a service
 * @apiName DeleteService
 * @apiGroup Service
 *
 * @apiParam  {String}  service_id
 *
 * @apiUse UnauthorizedError
 */
router.delete('/:service_id', (req, res) => {
  winston.debug(`DELETE /services/${req.params.service_id}`);

  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.status(401).end();
  } else {
    Service.findOneAndRemove({ _id: req.params.service_id })
      .then(() => {
        res.end();
      })
      .catch(error => {
        winston.error(error);
        res.status(500).end();
      });
  }
});

module.exports = router;

