'use strict';

const service = require('feathers-sequelize');
const alert = require('./alert-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: alert(app.get('sequelize'))};

  // Initialize our service with any options it requires
  app.use('/alerts', service(options));

  // Get our initialize service to that we can bind hooks
  const alertService = app.service('/alerts');

  // Set up our before hooks
  alertService.before(hooks.before);

  // Set up our after hooks
  alertService.after(hooks.after);
};
