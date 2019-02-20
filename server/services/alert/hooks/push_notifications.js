let gcm = require('node-gcm');
let apn = require('apn');

export default function sendPushNotification(hook) {
    let {category, user_id, from_id, post_id} = hook.result.dataValues;
    let registration_id;
    hook.app.service('users').get(user_id).then((savedUser) => {
        registration_id = savedUser.dataValues.registration_id;
        if (registration_id && notificationAllowed(category, savedUser.dataValues, from_id)) {
            sendGCM(registration_id, hook, category);
            sendAPN(registration_id, hook, category);
        }
    });
}

function notificationAllowed(category, user, from_id) {
    if (String(user.id) !== String(from_id)) {
        if (category === 'new_follower' && user.follower_notifications) {
            return true;
        }
        else if (category === 'rate' && user.rating_notifications) {
            return true;
        }
        else if (category === 'comment' && user.comment_notifications) {
            return true;
        }
    }
    return false;
}

function sendGCM(registration_id, hook, category) {
    let device_tokens = [];
    let retry_times = 4;
    let gcmApiKey = hook.app.get('gcmApiKey');
    let sender = new gcm.Sender(gcmApiKey);
    let message = new gcm.Message(); // create a new message
    switch (category) {
        case 'new_follower':
            message.addData('title', 'New Follower');
            message.addData('message', "You have a new follower!");
            message.addData('sound', 'default');
            message.collapseKey = 'MyPalate New Follower'; // grouping messages
            break;
        case 'rate':
            message.addData('title', 'Rating');
            message.addData('message', "Someone rated your post!");
            message.addData('sound', 'default');
            message.collapseKey = 'MyPalate New Rating'; // grouping messages
            break;
        case 'comment':
            message.addData('title', 'Comment');
            message.addData('message', "Someone commented on your post!");
            message.addData('sound', 'default');
            message.collapseKey = 'MyPalate New Comment'; // grouping messages
            break;
        default:
            break;
    }
    message.delayWhileIdle = true; // delay sending while receiving device is offline
    message.timeToLive = 3; // number of seconds to keep the message on 
    // server if the device is offline

    device_tokens[0] = registration_id;
    sender.send(message, device_tokens[0], retry_times, function (result) {
        console.log('push sent to: ' + device_tokens);
    }, function (err) {
        console.log('there was an error sending notification, ', err);
    });
}

function sendAPN(registration_id, hook, category) {

    let options = {
        cert: process.env.CERT_PEM,
        key: process.env.KEY_PEM,
        production: false
    };
    let apnConnection = new apn.Connection(options);
    let myDevice = new apn.Device(registration_id);

    let note = new apn.Notification();

    switch (category) {
        case 'new_follower':
            note.alert = "You have a new follower!";
            break;
        case 'rate':
            note.alert = "Someone rated you post!";
            break;
        case 'comment':
            note.alert = "Someone commented on your post!";
            break;
        default:
            break;
    }

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.payload = {};

    apnConnection.pushNotification(note, myDevice);
    apnConnection.on('error', function(error){
        console.log('error: ', error);
    });
    apnConnection.on('socketError', function(error){
        console.log('socket error: ', error);
    });
    apnConnection.on('transmissionError', function(errorCode, notification, device){
        console.log('transmission error: ', errorCode, notification, device );
    });
    apnConnection.on('completed', function(){
        console.log('sending completed');
    });
    


}
