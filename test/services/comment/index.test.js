'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('comment services', function() {
  it('registered the comments services', () => {
    assert.ok(app.service('comments'));
  });
});
