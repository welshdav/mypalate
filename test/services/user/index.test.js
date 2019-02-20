'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('user services', function() {
  it('registered the users services', () => {
    assert.ok(app.service('users'));
  });
});
