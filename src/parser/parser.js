// This is an example of how to use a nearley-made grammar.
//const nearley = require('nearley')
//const grammar = require('./grammar2.js')
//const assert = require('assert')
//const math = require('mathjs')
//const escape = require('regexp.escape') not sure need convert $ to smth like %u060B than \\$ that works badly with moo
const escapeStringRegexp = require('escape-string-regexp');
const nearley = require('nearley')
const grammar = require('./grammar.js')

//const DEBUG = process.env.DEBUG
const currencies = require('../currencies')

const { unitNames, unitPrefixes, /*refreshCurrencyUnits*/ } = require('../unitUtil')
//const { fixedRates } = require('./fixedRates')

//const { /*clearAllUserVariables,*/ isUserVariable, createUserVariable } = require('./userVariables')
const { scales, /* isUnit,*/ lexemSeparator, /* log */} = require('../common')
//const { setContext } = require('./parserContext')

//const ALMOST=true


// see grammar.ne->FUNC
const StandartFunctions = 'sin cos tan tg con ctg asin acos atan atg sqrt ln lg'.split(' ')

// magically adapting text for grammar parser
export function prepareTxt(text, verbose=false) {
  let txt = text

  // 21.1) remove all "string comments"
  txt = txt.replace(new RegExp('".*?"', 'g'), '')
  // 21.2 remove all //double-slashed comments
  txt = txt.replace(new RegExp('//.*', 'g'), '')
  // 21.3 remove all #comments
  txt = txt.replace(new RegExp('#.*', 'g'), '')
  // 21.4 remove label:
  txt = txt.replace(new RegExp('.*:', 'g'), '')

  // 3) simplify modifying assignments (like "a += 10" -> "a = a + 10") (reason implement it in grammar without copypaste is harder)
  txt = txt.replace(/(.*)([-+*/])=(.*)/, '$1 = $1 $2 ( $3 )')

  // 5) remove multispaces
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')

  // 10) put spaces around all math braces (to simplify implicit multiplication grammar)
  //txt = txt.replace(new RegExp('([\(\)])', 'gi'), ' $1 ')
  txt = txt.replace(new RegExp('\\s*([()])\\s*', 'gi'), ' $1 ')

  // 20) remove spaces between standard function calls braces likd "sin(...)" (to avoid confusion with multiplication to variable)
  // Example: "sin (...)" => "sin(...)"
  const st = StandartFunctions.join('|')  // 'sin|cos|tag|asin|acos|atan|sqrt|ln'
  //txt = txt.replace(new RegExp(`(${st})\s+`, 'gi'), ' $1')
  txt = txt.replace(new RegExp(`(\\W+|^)(${st})\\s*\\(`, 'gi'), '$1$2(')


  // 30) Add spaces before all +/- signs (to simplify unary/binary sign logic)
  txt = txt.replace(new RegExp(`\\s*([+-])`, 'gi'), ' $1')


  // 34) convert scaled numbers (2.3k -> 2300) (in prepare to avoid confusing with units)
  const S = Object.keys(scales).join('|')
  txt = txt.replace(
    new RegExp(`([0-9]+(?:\\.\\d+)?)(?:\\s*)(${S})((?:[^a-zA-Z]|$))`, 'g'),
    (m, number, scale, post) => `${Number(number)*scales[scale]}${post}`
  )

  // 35) Convert currencies to ISO format (math.js not support symbols like "$" or "฿")

  // 35.0) convert pre&post-sign: "$18.5 USD" -> "18.5 USD" for every currency SINGLE-chars
  const currSymbols = Object.keys(currencies.symbolToCode).map(escapeStringRegexp).join('|')
  txt = txt.replace(
    new RegExp(`(\\W+|^)(${currSymbols})\\s*(\\d+(?:\\.\\d+)?)\\s*(${currSymbols})`, 'gi'),
    (match, pre, curr1, amount, curr2) =>
      `${pre}${amount} ${currencies.detect(curr2)}`
  )

  // 35.1) convert currencies pre-sign to ISO: "$18.5" -> "18.5 USD" for every currency SINGLE-chars
  txt = txt.replace(
    new RegExp(`(\\W+|^)(${currSymbols})\\s*(\\d+(?:\\.\\d+)?)`, 'gi'),
    (match, pre, curr, amount) => `${pre}${amount} ${currencies.detect(curr)}`
  )

  // 35.2) convert remained signs (probably past-): "$" -> "USD"
  txt = txt.replace(
    new RegExp(`([^A-Za-z_]+?|^)(${currSymbols})(\\W+|$)`, 'gi'),
    (match, begin, curr, end) => `${begin} ${currencies.detect(curr)} ${end}`
  )

  // 35.9)
  txt = txt.replace(new RegExp(`as a % of`, 'gi'), 'asapercentof')
  txt = txt.replace(new RegExp(`as a % on`, 'gi'), 'asapercenton')
  txt = txt.replace(new RegExp(`as a % off`, 'gi'), 'asapercentoff')
  txt = txt.replace(new RegExp(`of what is`, 'gi'), 'ofwhatis')
  txt = txt.replace(new RegExp(`on what is`, 'gi'), 'onwhatis')
  txt = txt.replace(new RegExp(`off what is`, 'gi'), 'offwhatis')

  // 36) replace '%' to 'PERCENT' (mathjs not support % sign)
  txt = txt.replace(new RegExp(`%`, 'gi'), 'PERCENT')

  // 40) wrap all units (USD, Gb, kg...) by lexem separator: " kg;"
  //    reason: to parse '10 cm' and same time avoid word cropping "1 and 2 m"ul 3
  const UP = unitPrefixes().map(escape).join('|')
  const UN = unitNames().map(escape).join('|')
  txt = txt.replace(new RegExp(`([^a-zA-Z_])(${UP})(${UN})((?:[^a-zA-Z_]|$))`, 'g'), `$1 $2$3${lexemSeparator} $4`)


  // (just not include confisuign units to unitNames)
  //
  // //40-2) back: remove ";" from confusing units (   ??!! better way (just not add first)
  // const CU = confusingUnits.map(escape).join('|')
  // txt = txt.replace(new RegExp(` (${CU}); `, 'gi'), ' $1 ')

  // 45) add '<EOL>' to the END of line
  txt += '<EOL>'

  // 50) remove multispace (produced user, 4)) reason: to avoid multiresults
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')


  if (verbose) console.log(`"${text}" -p-> "${txt}"`)

  return txt
}

export function createParser() {
  return new nearley.Parser(grammar.ParserRules, grammar.ParserStart, { keepHistory: true, foo: 'bar'})
}
