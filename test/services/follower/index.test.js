'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('follower service', function() {
  it('registered the followers service', () => {
    assert.ok(app.service('followers'));
  });
});
