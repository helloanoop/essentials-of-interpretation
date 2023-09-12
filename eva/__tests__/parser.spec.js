const assert = require('assert');
const parse = require('../parser');

// letter
assert.strictEqual(parse('a'), 'a');

// digit
assert.strictEqual(parse('1'), '1');

// letters
assert.strictEqual(parse('abc'), 'abc');

// digits
assert.strictEqual(parse('123'), '123');

// simple math expression
assert.deepStrictEqual(parse('(+ 1 2)'), ['+', '1', '2']);

// nested math expression
assert.deepStrictEqual(parse('(+ 1 (+ 2 3))'), ['+', '1', ['+', '2', '3']]);

// variables
assert.deepStrictEqual(parse('(var x 10)'), ['var', 'x', '10']);

// begin block
assert.deepStrictEqual(parse('(begin (var x 10))'), ['begin', ['var', 'x', '10']]);

// multi-line block
assert.deepStrictEqual(parse(`
  (begin
    (var x 10)
    (var y 20)
  )
`), ['begin', ['var', 'x', '10'], ['var', 'y', '20']]);

console.log("All parser tests passed");

// while loop
assert.deepStrictEqual(parse(`
  (begin
    (var counter 0)
    (var result 0)

    (while (< counter 10)
      (begin
        (set result (+ result 1))
        (set counter (+ counter 1))
      )
    )
    result
  )
`),
['begin',
  ['var', 'counter', '0'],
  ['var', 'result', '0'],
  ['while', ['<', 'counter', '10'],
    ['begin',
      ['set', 'result', ['+', 'result', '1']],
      ['set', 'counter', ['+', 'counter', '1']],
    ]
  ],
  'result'
]);
