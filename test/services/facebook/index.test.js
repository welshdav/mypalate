'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('facebook service', function() {
  it('registered the facebooks service', () => {
    assert.ok(app.service('facebooks'));
  });
});
