const {
  str,
  choice,
  char,
  letters,
  digits,
  many,
  many1,
  whitespace,
  recursiveParser,
  sequenceOf,
} = require('arcsecond');

const expression = choice([
  char('+'),
  char('-'),
  char('*'),
  char('/'),
  char('<'),
  char('>'),
  char('='),
  str('<='),
  str('>='),
  str('!='),
  many1(choice([
    letters,
    digits
  ])).map(result => result.join('')),
  whitespace,
]);

const parser = recursiveParser(() => choice([
  expression,
  sequenceOf([
    char('('),
    many(parser),
    char(')'),
  ]).map(result => result[1])
])).map(result => {

  if(Array.isArray(result)) {
    return result.filter(value => {
      if(typeof value !== 'string') {
        return true;
      }

      return value.trim().length > 0;
    });
  }

  return result;
});

// Debugging
// let input = `
// (begin
//   (var x 10)
//   (var y 20)
// )
// `;
// console.log(
//   JSON.stringify(
//     parser.run(input.replace(/\n/g, ' ').trim()),
//     null,
//    2
//   )
// );

const parse = input => parser.run(input.replace(/\n/g, ' ').trim()).result;

module.exports = parse;
