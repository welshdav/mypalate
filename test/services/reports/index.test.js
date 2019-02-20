'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('report service', function() {
  it('registered the reports service', () => {
    assert.ok(app.service('reports'));
  });
});
