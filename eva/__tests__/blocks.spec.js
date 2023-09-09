const assert = require('assert');

module.exports = eva => {
  // simple block
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
  
  // scope resolution
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
  
  // scope resolution
  assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'data', 10],
      ['begin',
        ['set', 'data', 20],
      ],
      'data'
    ]
  ), 20);
};