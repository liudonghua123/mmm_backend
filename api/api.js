/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const path = require('path');

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
const DB = dbService(environment, config.migrate).start();

// add swagger doc, see https://github.com/pgroot/express-swagger-generator
// eslint-disable-next-line import/no-extraneous-dependencies
const expressSwagger = require('express-swagger-generator')(app);

const options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: `localhost:${config.port}`,
    basePath: '/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, // app absolute path
  files: ['./controllers/**/*.js'], // Path to the API handle folder
};
expressSwagger(options);

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// serve static files
app.use(express.static(path.join(__dirname, '../build'), {
  setHeaders: (res, filePath) => {
    console.info(`static file ${filePath} served`);
    res.set('x-timestamp', Date.now());
  },
}));
// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
app.all('/api/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/api/public', mappedOpenRoutes);
app.use('/api/private', mappedAuthRoutes);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

server.listen(config.port, () => {
  console.info(`app is running on port ${config.port}`);
  if (environment !== 'production' && environment !== 'development' && environment !== 'testing') {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
