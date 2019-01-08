const privateRoutes = require('./routes/privateRoutes');
const publicRoutes = require('./routes/publicRoutes');

const config = {
  migrate: true,
  privateRoutes,
  publicRoutes,
  port: process.env.PORT || '2017',
  debug: process.env.NODE_ENV !== 'production',
};

module.exports = config;
