const assert = require("assert");
const Eva = require("./eva");
const Environment = require("./environment");

const eva = new Eva(new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1'
}));

assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');
assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
assert.strictEqual(eva.eval(['+', ['*', 3, 2], 5]), 11);
assert.strictEqual(eva.eval(['var', 'x', 21]), 21);
assert.strictEqual(eva.eval(['var', 'y', 42]), 42);
assert.strictEqual(eva.eval('x'), 21);
assert.strictEqual(eva.eval('y'), 42);
assert.strictEqual(eva.eval('VERSION'), '0.1');
assert.strictEqual(eva.eval('true'), true);
assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);

assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'x', 10],
    ['var', 'y', 20],
    ['+', ['*', 'x', 'y'], 30]
  ]
), 230);

// nested blocks
assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'x', 10],
    ['begin',
      ['var', 'x', 20],
      'x'
    ],
    'x'
  ]
), 10);

assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'value', 10],
    ['var', 'result',
      ['begin',
        ['var', 'x', ['+', 'value', 10]],
        'x'
      ]
    ],
    'result'
  ]
), 20);

assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'data', 10],
    ['begin',
      ['set', 'data', 20],
    ],
    'data'
  ]
), 20);

console.log("All tests passed");