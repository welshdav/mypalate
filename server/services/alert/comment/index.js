'use strict';

const service = require('feathers-sequelize');
const comment = require('./comment-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: comment(app.get('sequelize'))};

  // Initialize our services with any options it requires
  app.use('/comments', service(options));

  // Get our initialize services to that we can bind hooks
  const commentService = app.service('/comments');

  // Set up our before hooks
  commentService.before(hooks.before);

  // Set up our after hooks
  commentService.after(hooks.after);
};
