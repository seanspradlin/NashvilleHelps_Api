'use strict';
const config = require('./config');
const express = require('express');
const winston = require('winston');
const app = express();

app.listen(config.port, () => {
  winston.log(`Server is running on port ${config.port}`);
});

