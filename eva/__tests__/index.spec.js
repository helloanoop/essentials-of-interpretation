const Eva = require("../eva");

// run parser tests
require('./parser.spec');

const tests = [
  require('./self-eval.spec'),
  require('./math.spec'),
  require('./variables.spec'),
  require('./blocks.spec'),
  require('./if.spec'),
  require('./while.spec'),
  require('./native-functions.spec'),
  require('./user-defined-functions.spec'),
  require('./lambda-functions.spec'),
];

tests.forEach(test => test(new Eva()));


console.log("All interpreter tests passed");