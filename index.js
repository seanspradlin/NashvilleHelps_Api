const path = require('path');
const config = require('./config');
const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('./lib/passport');
const session = require('express-session');
const routes = require('./routes');
const staticPath = path.resolve(config.static);
const app = express();

winston.level = config.logLevel;

app.use(express.static(staticPath));
app.use(helmet());
app.use('/docs', express.static(`${__dirname}/docs`));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(config.port, () => {
  winston.info(`Server is running on port ${config.port}`);
});

