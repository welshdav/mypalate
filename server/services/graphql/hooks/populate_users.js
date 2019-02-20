const defaults = {
  userEndpoint: '/users',
  idField: '_id'
};

export default function populateUser({ app, payload, authOptions }){
    let id;

    let options = Object.assign({}, defaults, authOptions);

    // Check to see if we have an id from a decoded JWT
    if (payload) {
      id = payload[options.idField];
    }
    
    // If we didn't find an id then just pass through
    if (id === undefined) {
      return Promise.resolve({});
    }
    return new Promise(function(resolve, reject){
      app.service(options.userEndpoint).get(id, {}).then(user => {
        return resolve(user);
      }).catch(reject);
    });
}
