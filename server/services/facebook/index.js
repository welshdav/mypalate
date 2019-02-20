'use strict';
import errors from 'feathers-errors';
import jwt from 'jsonwebtoken';
const hooks = require('./hooks');

class Service {
  constructor(options) {
    this.options = options || {};
  }
  setup(app){
    this.app = app;
  }

  get(id, params) {
    if (id !== 'login') {
      return Promise.reject(new errors.NotFound());
    }
    let {email, facebookId} = params.query;
    return this.app.service('users').find({
      query: {
        email,
        facebookId
      }
    }).then(users => {
      if (users && users[0]){
        let user = users[0];
        let secret = this.app.get('auth').token.secret;
        let token = jwt.sign({id: user.id}, secret, {})
        return {
          token, 
          data: user
        }
      }
    })
  }

}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/facebook', new Service());

  // Get our initialize service to that we can bind hooks
  const facebookService = app.service('/facebook');

  // Set up our before hooks
  facebookService.before(hooks.before);

  // Set up our after hooks
  facebookService.after(hooks.after);
};

module.exports.Service = Service;
