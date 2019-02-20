use strict';

const hooks = require('./hooks');
import verifyToken from './hooks/verify-token';
import populateUser from './hooks/populate-user';
import registerDevice from './hooks/register-device';
import {apolloServer} from 'apollo-server';
import Resolvers from  './resolvers';
import Schema from './schema';
import Mocks from './mocks';
module.exports = function () {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/graphql', apolloServer((req) => {
    let {token, provider} = req.feathers;
    let authOptions = app.get('auth');
    let registration = req.headers.registration || null;
    return verifyToken({
      token,
      provider,
      authOptions
    }).then(payload => populateUser({
      app,
      payload,
      authOptions
    })).then(user => {
      return registerDevice({
        app,
        registration,
        user
      }).then(() => user)
    }).then(user => {
      return {
        graphiql: true,
        pretty: true,
        schema: Schema,
        resolvers: Resolvers.call(app),
        context: {
          token,
          provider,
          user: user.dataValues,
        }
      }
    })
  }))
}
