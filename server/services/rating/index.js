'use strict';

const service = require('feathers-sequelize');
const rating = require('./rating-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: rating(app.get('sequelize'))};

  // Initialize our service with any options it requires
  app.use('/ratings', service(options));

  // Get our initialize service to that we can bind hooks
  const ratingService = app.service('/ratings');

  // Set up our before hooks
  ratingService.before(hooks.before);

  // Set up our after hooks
  ratingService.after(hooks.after);
};
