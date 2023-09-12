const assert = require('assert');
const parser = require('../parser');

const test = function(eva, code, expected) {
  const ast = parser(code);
  if(!ast || !ast.length) {
    throw Error('AST not found');
  }

  assert.strictEqual(eva.eval(ast), expected);
}

module.exports = {
  test
};