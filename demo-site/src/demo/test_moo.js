const moo = require('moo')
const math = require('mathjs')

const currencies = require('./currencies')
const escapeStringRegexp = require('escape-string-regexp');

const { specVariables } = require('./common')


// TODO: merge fu remove copypastes with tests
// NOTE: but need consider parsing non-prepared TXT
const UnitNames = Object.values(math.type.Unit.UNITS).map( u => u.name)
const UnitPrefixes = Object.keys(math.type.Unit.PREFIXES.SHORTLONG)
const UP = UnitPrefixes.map(escape).join('|')
const UN = UnitNames.map(escape).join('|')

// $, ₴, ...
let currSymbolsList = Object.keys(currencies.symbolToCode).map(escapeStringRegexp)
// append lower-cased curr symbols (cos moo not support ignore-case regexps)
currSymbolsList = currSymbolsList.concat( currSymbolsList.map(x => x.toLocaleLowerCase()) )
const currSymbols = currSymbolsList.join('|')

//console.log('currSymbols', currSymbols)

// highlightGrammar entered by user OR from prepareTxt (BOTH)
const highlightGrammar = {
  float: new RegExp('\\d+(?:\\.\\d+)?'),

  comment: new RegExp('//.*'),
  hashComment: new RegExp('#.*'),
  stringComment: new RegExp('".*?"'),
  label: new RegExp('.*:'),

  plus: ['+', 'plus', 'and', 'with'],
  minus: ['-', 'minus', 'subtract', 'without'],
  mul: ['*', 'times', 'multiplied by', 'mul'],
  divide: ['/', 'divide', 'divide by'],
  exp: ['^'],
  mod: ['mod'],
  leftShift: ['<<'],
  rightShift: ['>>'],
  convert: [
    'in', 'into', 'as', 'to',
    'of',

    'of what is', 'on', 'off', 'off what is',
    'ofwhatis', 'onwhatis', 'offwhatis',

    'as a % of', 'as a % on', 'as a % off',
    'asapercentof', 'asapercenton', 'asapercentoff',
  ],

  semicolon: ';',

  percent: ['%', 'PERCENT'],

  specVariables: specVariables,

  func: ['sin', 'cos', 'tan', 'asin', 'acos', 'atag', 'sqrt', 'ln'],
  constant: ['pi', 'e'],

  currency: new RegExp(`(?:${currSymbols})`),
  //currency: new RegExp(`(?:USD|UAH|\\$|\\€)`),

  unit: new RegExp(`(?:${UP})(?:${UN})`),


  comment: /\/\/.*?$/,
  //number: /0|[1-9][0-9]*/,
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  lparen: '(',
  rparen: ')',
  keyword: ['while', 'if', 'else', 'moo', 'cows'],
  //NL: { match: /\n/, lineBreaks: true },

  WS: { match: new RegExp('\\s+'), lineBreaks: true }, // somewhy moo requires lineBreaks

  unknown: new RegExp('\\S+')
}

const highlightLexer = moo.compile(highlightGrammar)

// 
// function tokenize(text) {
//   const r = []
//   highlightLexer.reset(text)
// 
//   for (let item of highlightLexer) {
//     //console.log('-', item.value)
//     r.push(`${item.value}:${item.type}`)
//   }
// 
//   // let item;
//   // while (true) {
//   //   item = highlightLexer.next()
//   //   if (!item) break;
//   // 
//   //   //if (['WS', 'semicolon'].includes(item.type)) continue;
//   //   console.log('-', item.value)
//   //   
//   //   /* switch (item.type) {
//   //       *     case 'plus':
//   //       *        r.push('<', item.value, '>');
//   //       *        break;
//   //       *   default:
//   //       *     r.push(item.value)
//   //       * } */
//   //   r.push(`${item.value}:${item.type}`)
//   // }
// 
//   return r
// }
// 

// function fmt(text) {
//   const tokens = tokenize(text)
//   //console.log('tokens:', tokens)
//   //console.log('R:', text, '\n ', tokens)
// }
// 
// if (require.main === module) {
//   // that user in put
//   fmt('12.3 kg + 45 cm + pi / 2')
//   fmt('€12.3 + $12.5')
//   fmt('(€12.3 * 2) + 12.5 kg')
//   fmt('50$ as a % of 100$')
// 
//   fmt('50 USD; asapercentof 100 USD;')
// 
//   fmt('3 + 4')
//   fmt('4 + 5 ')
//   fmt('12   ')
// 
//   fmt('prev ')
// 
//   fmt('17 \n')
//   //fmt('d')
// }

module.exports = { highlightLexer }
