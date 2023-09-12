const assert = require('assert');
const parser = require('../parser');

const test = function(eva, code, expected) {
  assert.strictEqual(eva.eval(parser(code)), expected);
}

module.exports = {
  test
};