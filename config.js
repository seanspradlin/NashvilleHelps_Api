'use strict';
module.exports = {
  db: {
    url: process.env.MONGO_URL || 'mongodb://mongo/nash-helps',
  },
  logLevel: process.env.LOG_LEVEL || 'debug',
  port: process.env.PORT || 8080,
  session: {
    secret: process.env.SESSION_SECRET || 'hunter2',
    resave: false,
    saveUninitialized: true,
  },
  static: process.env.STATIC_ROOT || '../client',
};

