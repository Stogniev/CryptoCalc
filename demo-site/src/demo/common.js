// TODO: add all
//export const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']

// TODO: add all
//export const Units = ['cm', 'm', 'km', 'usd', 'uah',]



const scales = {
  'k': 1E3,
  'thousand': 1E3,
  'thousands': 1E3,
  'M': 1E6,
  'million': 1E6,
  'millions': 1E6,
  'billion': 1E9,
  'billions': 1E9
}


const lexemSeparator = ';'

function getUnitName(u) {
  return u.units[0].prefix.name + u.units[0].unit.name
}

// --- math helper
const math = require("mathjs");

function isUnit(x) {
  return x instanceof math.type.Unit
}

// convert n to baseUnit unit
function toUnit(n, baseUnit) {
  return math.unit(n, getUnitName(baseUnit))
}
//--------------

function isPercent(x) {
  return isUnit(x) && getUnitName(x) === 'PERCENT'
}

function isMeasure(x) {
  return isUnit(x) && !isPercent(x)
}

function isNumber(x) {
  return typeof(x) === 'number'
}


// // for human
// function formatAnswerExpression(answer) {
//   let r = answer.lexer.buffer
//   r = r.replace(new RegExp(lexemSeparator, 'g'), '')  // clear all ";" separators
//   r = r.replace(new RegExp('PERCENT', 'g'), '%')  // PERCENT -> %
//   return r
// }



// used to humanize back parsed expression
const answerExpressionHumanizers = {
  ofwhatis: 'of what is',
  onwhatis: 'on what is',
  offwhatis: 'off what is',
  asapercentof: 'as a % of',
  asapercenton: 'as a % on',
  asapercentoff: 'as a % off',

  plus: '+',
  and: '+',
  with: '+',

  minus: '-',
  subtract: '-',
  without: '-',

  times: '*',
  'multiplied by': '*',
  mul: '*',

  divide: '/',
  'divide by': '/',

  [lexemSeparator]: '',

  PERCENT: '%',
  '<EOL>': '',
}

function formatAnswerExpression(text) {
  let r = text
  //r = r.replace(new RegExp(lexemSeparator, 'g'), '')  // clear all ";" separators

  // TODO: refactor (https://stackoverflow.com/a/15604206/1948511)
  Object.entries(answerExpressionHumanizers).forEach(
    ([from, to]) => r = r.replace(new RegExp(from, 'g'), to)
  )

  return r
}


const specVariables = ['sum', 'total', 'average', 'avg', 'prev']

module.exports = { getUnitName, isUnit, isPercent, isMeasure, isNumber, toUnit, lexemSeparator, scales, formatAnswerExpression, specVariables }

