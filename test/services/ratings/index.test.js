'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('rating service', function() {
  it('registered the ratings service', () => {
    assert.ok(app.service('ratings'));
  });
});
