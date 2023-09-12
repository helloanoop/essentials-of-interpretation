const Eva = require("../eva");
const Environment = require("../environment");

// run parser tests
require('./parser.spec');

const tests = [
  require('./self-eval.spec'),
  require('./math.spec'),
  require('./variables.spec'),
  require('./blocks.spec'),
  require('./if.spec'),
  require('./while.spec'),
];

const eva = new Eva(new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1'
}));

tests.forEach(test => test(eva));


console.log("All interpreter tests passed");