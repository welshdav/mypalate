'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
import sendPushNotification from './push-notifications';
import restrictToOthers from './restrict-to-others';

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    restrictToOthers,
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    sendPushNotification
  ],
  update: [],
  patch: [],
  remove: []
};
