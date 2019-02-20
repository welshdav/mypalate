'use strict';

const service = require('feathers-sequelize');
const report = require('./report-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: report(app.get('sequelize'))
  };

  // Initialize our service with any options it requires
  app.use('/reports', service(options));

  // Get our initialize service to that we can bind hooks
  const reportService = app.service('/reports');

  // Set up our before hooks
  reportService.before(hooks.before);

  // Set up our after hooks
  reportService.after(hooks.after);
};
