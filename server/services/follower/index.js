'use strict';

const service = require('feathers-sequelize');
const follower = require('./follower-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: follower(app.get('sequelize')),
  };

  // Initialize our service with any options it requires
  app.use('/followers', service(options));

  // Get our initialize service to that we can bind hooks
  const followerService = app.service('/followers');

  // Set up our before hooks
  followerService.before(hooks.before);

  // Set up our after hooks
  followerService.after(hooks.after);
};
