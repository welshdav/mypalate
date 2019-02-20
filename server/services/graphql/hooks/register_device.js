export default function registerDevice({ app, user, registration }) {

    // If we didn't find an id then just pass through
    if (!registration || registration === null) {
        return Promise.resolve({});
    }
    return new Promise(function (resolve, reject) {
        app.service('users').patch(user.id, {
            registration_id: registration
        }).then(savedUser => {
            return resolve(savedUser);
        }).catch(reject);
    });
}
