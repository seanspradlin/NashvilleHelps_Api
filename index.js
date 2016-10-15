'use strict';
const config = require('./config');
const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(config.port, () => {
  winston.log(`Server is running on port ${config.port}`);
});

