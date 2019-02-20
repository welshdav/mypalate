import jwt from 'jsonwebtoken';
import errors from 'feathers-errors';

export default function verifyToken({ token, provider, authOptions }){
    // If it was an internal call then skip this hook
    if (!provider) {
      return Promise.resolve({});
    }
    if (!token) {
      throw new errors.NotAuthenticated('Authentication token missing.');
    }  
    let options = Object.assign({}, authOptions.token);
    const secret = options.secret;
    if (!secret) {
      throw new Error(`You need to pass 'options.secret' to the verifyToken() hook or set 'auth.token.secret' it in your config.`);
    }
    // Convert the algorithm value to an array
    if (options.algorithm) {
      options.algorithms = [options.algorithm];
      delete options.algorithm;
    }
    return new Promise(function(resolve, reject){
      jwt.verify(token, secret, options, function (error, payload) {
        if (error) {
          // Return a 401 if the token has expired or is invalid.
          return reject(new errors.NotAuthenticated(error));
        }
        resolve(payload);
      });
    });
  };    
