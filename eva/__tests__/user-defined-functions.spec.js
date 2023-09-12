const assert = require('assert');
const {test} = require("./test-util");

module.exports = eva => {
  // Simple function
  test(eva,`
    (begin
      (def square (x) (* x x))

      (square 2)
    )
  `, 4)
};