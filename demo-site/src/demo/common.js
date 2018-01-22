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

const confusingUnits = [
  'as', 'in',   // used for money conversion
//!!?  'a' // used as word in "as a % of"
]

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

// for human
function formatAnswerExpression(answer) {
  let r = answer.lexer.buffer
  r = r.replace(new RegExp(lexemSeparator, 'g'), '')  // clear all ";" separators
  r = r.replace(new RegExp('PERCENT', 'g'), '%')  // PERCENT -> %
  return r
}

module.exports = { getUnitName, isUnit, isPercent, isMeasure, isNumber, toUnit, confusingUnits, lexemSeparator, scales, formatAnswerExpression }
