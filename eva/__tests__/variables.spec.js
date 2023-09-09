const assert = require('assert');

module.exports = eva => {
  assert.strictEqual(eva.eval(['var', 'x', 21]), 21);
  assert.strictEqual(eva.eval(['var', 'y', 42]), 42);
  assert.strictEqual(eva.eval('x'), 21);
  assert.strictEqual(eva.eval('y'), 42);
  assert.strictEqual(eva.eval('VERSION'), '0.1');
  assert.strictEqual(eva.eval('true'), true);
  assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);
};