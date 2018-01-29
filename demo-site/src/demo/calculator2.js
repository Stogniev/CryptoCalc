// This is an example of how to use a nearley-made grammar.
const PROMPT = '> '
const nearley = require('nearley')
const grammar = require('./grammar2.js')
const assert = require('assert')
const math = require('mathjs')
//const escape = require('regexp.escape') not sure need convert $ to smth like %u060B than \\$ that works badly with moo
const escapeStringRegexp = require('escape-string-regexp');

const DEBUG = process.env.DEBUG
const currencies = require('./currencies')
const rates = require('./rates')

const {
  scales, isUnit, lexemSeparator, confusingUnits, formatAnswerExpression
} = require('./common')

// Create units for every currency code (without subunits)
math.createUnit('USD')
currencies.codes.forEach( code => {
  if (code === 'USD') return;
  if (!rates.hasOwnProperty(code)) return;

  math.createUnit(code, {definition: `${rates[code]} USD`})
})


const ALMOST=true

//create percent unit
math.createUnit('PERCENT')


function assertEqual(a, b, almost=false) {
  function getValue(v) {
    if (v instanceof math.type.Unit) {
      return String(v)
    }
    return v
  }

  try {
    a = getValue(a)
    b = getValue(b)
    assert(almost ? Math.abs(a - b) < 0.1 : a === b)
  } catch (e) {
    console.warn(`"${a}" !=\n"${b}"`)
    throw e
  }
}



// TODO: add all
const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']

const UnitNames = Object.values(math.type.Unit.UNITS).map( u => u.name)
const UnitPrefixes = Object.keys(math.type.Unit.PREFIXES.SHORTLONG)

// magically adapting text for grammar parser
function prepareTxt(text, verbose=false) {
  let txt = text

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
    (m, number,    scale,post) => `${Number(number)*scales[scale]}${post}`
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
    new RegExp(`([^A-Za-z_]+|^)(${currSymbols})(\\W+|$)`, 'gi'),
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
  const UP = UnitPrefixes.map(escape).join('|')
  const UN = UnitNames.map(escape).join('|')
  txt = txt.replace(new RegExp(`([^a-zA-Z])(${UP})(${UN})((?:[^a-zA-Z]|$))`, 'g'), `$1 $2$3${lexemSeparator} $4`)

  //40-2) back: remove ";" from confusing units (   ??!! better way (just not add first)
  const CU = confusingUnits.map(escape).join('|')
  txt = txt.replace(new RegExp(` (${CU}); `, 'gi'), ' $1 ')

  // 50) remove multispace (produced user, 4)) reason: to avoid multiresults
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')


  if (verbose) console.log(`"${text}" -p-> "${txt}"`)

  return txt
}

function call(text, verbose=DEBUG) {
  return prepareAndParse(text, verbose).results[0]
}

// TODO: refactor with call
function prepareAndParse(text, verbose=false) {
  const txt = prepareTxt(text, verbose)

  try {
    const parser = new nearley.Parser(
      grammar.ParserRules, grammar.ParserStart, { keepHistory: true }).feed(txt);

    if (parser.results.length > 1) {
      console.warn(`Multiple result for "${txt}": ${parser.results}`)
    }

    if (parser.results.length === 0) {
      throw new Error(`Empty result for "${txt}"`)
    }

    if (verbose) {
      console.log(`"${txt}" -c-> "${parser.results}"`)
    }

    return parser

  } catch(e) {
    if (verbose) {
      console.log(`"${txt}" -E-> `, e)
    }
    throw e
  }
}






// mini-sandbox
//?assertEqual(call('(100 + 10%)4%/2'), '10 PERCENT')  //implicit conversion
//console.log(formatAnswerExpression('100 USD; asapercentof 200 USD;'))
//return




// math expressions
assertEqual(call('123'), 123)
assertEqual(call('3 + 2'), 5)

assertEqual(call('1 + 2 * 3'), 7)
assertEqual(call('1 + (2^3) - 2 * 3'), 3)

assertEqual(call('11 mod 4'), 3)
assertEqual(call('4 + 10 mod 4 * 2'), 8)

assertEqual(call('2 ^ 3'), 8)
assertEqual(call('(2 ^ 3)'), 8)

assertEqual(call('2(3)'), 6)
assertEqual(call('(2)3'), 6)
assertEqual(call('(2)(3)'), 6)
assertEqual(call('2(3)4'), 24)

assertEqual(call('(2 + 3) *4'), 20)

assertEqual(call('5(2 + 3)*4'), 100)
assertEqual(call('5*(2 + 3)4'), 100)
assertEqual(call('2*(3)*4'), 24)

assertEqual(call('2*(3)'), 6)
assertEqual(call('(2)*3'), 6)
assertEqual(call('(2)*(3)'), 6)

assertEqual(call('(2 + 3)*4'), 20)
assertEqual(call('5*(2 + 3)*4'), 100)


// math constants
assertEqual(call('e'), 2.7, ALMOST)
assertEqual(call('pi'), 3.14, ALMOST)
assertEqual(call('pi + 1'), 4.14, ALMOST)
assertEqual(call('1 + pi'), 4.14, ALMOST)

// implicit multiplication "*"
assertEqual(call('(3)7'), 21)
assertEqual(call('(1+7)3'), 24)
assertEqual(call('8(3)'), 24)
assertEqual(call('(3)(4)'), 12)

assertEqual(call('3(5-2)4'), 36)
assertEqual(call('(3-1) (8/4 + 1)'), 6)
assertEqual(call('(3-1)(8/4 + 1)'), 6)
assertEqual(call('3+ (7-4) 2'), 9)
assertEqual(call('2 (3 + 4)'), 14)
assertEqual(call('7 2'), 14)
assertEqual(call('2 + 3 (2+4) / 2'), 11)
assertEqual(call('1 + 3(5 + 4 - 6 / 3) / 2 * 4 - 3'), 40)

assertEqual(call('3.139 * 1'), 3.14, ALMOST)  //to constants
assertEqual(call('pi (7 - 5) - pi'), 3.14, ALMOST)  //to constants
assertEqual(call('pi(7 - 5)pi/(pi*pi) - 2'), 0)

// exponents
assertEqual(call('2^3'), 8)
assertEqual(call('2^3^2'), 512)
assertEqual(call('(2^3)^2'), 64)
assertEqual(call('2*3^2*3'), 54)
assertEqual(call('2 * 3 ^ 2 * 3'), 54)
assertEqual(call('2 * pi ^ 2 * 3'), 59.15, ALMOST)
// exponent + braces
assertEqual(call('2^2(3)'), 12)
assertEqual(call('(3)2^2'), 12, ALMOST)
assertEqual(call('(2)pi^2(3)'), 59.15, ALMOST)
assertEqual(call('4^-2'), 4 ** -2, )



// word-described math expressions
assertEqual(call('3 + 2'), 5)

assertEqual(call('1 and 2 multiplied by 3'), 7)
assertEqual(call('(1 and 2) multiplied by 3'), 9)
assertEqual(call('1 with 62 without 2 times 3'), 57)
assertEqual(call('4 mul 2 + 3 ^ 2'), 17, ALMOST)
assertEqual(call('18 divide by 2 multiplied by 2 ^ 2'), 36)

// math operations space tolerancy
assertEqual(call('18divide by2'), 9)
assertEqual(call('18divided by2multiplied by2 ^ 2'), 36)
assertEqual(call('18plus3minus1'), 20)


// bitwise shift
assertEqual(call('3 << 4'), 48)
assertEqual(call('99 >> 4'), 6)
assertEqual(call('3 << 4 << 2'), 192)
assertEqual(call('3 << (4 << 2)'), 196608)
assertEqual(call('3 << 4 + 1 << 2'), 384)
assertEqual(call('3 << 4 + 9 >> 2'), 6144)

// standard functions
//console.log(call('sin(2 pi)'),  call('2 sin(pi) cos(pi)'))
assertEqual(call('sqrt(81)'), 9)
//assertEqual(call('sqrt(-4)'), NaN)

assertEqual(call('sin(2 pi)'),  call('2 sin(pi) cos(pi)'), ALMOST)
assertEqual(call('tan(3 pi)'),  call('sin(3 pi)/cos(3 pi)'), ALMOST)
assertEqual(call('ln(e^5)'), 5)


// unary "+" and "-"
assertEqual(call('-5'), -5)
assertEqual(call('-5+8'), 3)
assertEqual(call('-5+8'), 3)
assertEqual(call('-1 - -1'), 0)
assertEqual(call('-sin(-pi/2)'), 1)
assertEqual(call('-(-1)'), 1)
assertEqual(call('-(-2 - -1)'), 1)

//consts
assertEqual(call('pi + e'), Math.PI + Math.E)

// floats
assertEqual(call('12.95 + 3.10'), 16.05, ALMOST)

// units
assertEqual(call('10 cm'), '10 cm')
assertEqual(call('-10 cm'), '-10 cm')

assertEqual(call('3 cm + 2 cm'), '5 cm')
assertEqual(call('3 km + 2m + 1  mm').value, 3002.001, ALMOST)

assertEqual(call('3 km - 500 m'), '2.5 km')

assertEqual(call('8m / 2'), '4 m')
assertEqual(call('(5+3)km'), '8 km')

try {
  call('2 kg + 4 cm')
} catch(e) {
  assertEqual(e.message, 'Units do not match')
}

try {
  call('2 fakeUnit')
} catch(e) {
  assertEqual(e.message, 'Empty result for "2 fakeUnit"')
}

try {
  assertEqual(call('2 tonne * 4 gram '), '6 kg^2')
} catch(e) {
  assert(e.message.includes('Empty result'))
}

assertEqual(call('4 kg  2'), '8 kg')
assertEqual(call('4 kg (1 - 0.5) + 100g'), '2.1 kg')


assertEqual(call('69 cm * 3 / 2 + 2km'), '2.001035 km')


try {
  call('2 kg ^ 2')   // cannot exponent units
} catch(e) {
  assert(e.message.includes('Unexpected'))
}

assertEqual(call('3(4kg - 2000 gram / 2) /2'), '4.5 kg')

// negative units
assertEqual(call('-2 m - (-3m)').value, 1, ALMOST)


try {
  call('2 kg << 2 ')
} catch(e) {
  assert(e.message.includes('Unexpected'))
}

try {
  call('12 / 2kg ')
} catch(e) {
  assert(e.message.includes('Empty result '))
}

assertEqual(call('(3+5) 2 kg * 2').value, 32)

// mixed subunits
assertEqual(String(call('1 meter 20 cm').toSI()), '1.2 m')
assertEqual(String(call('-1 meter 20 cm').toSI()), '-1.2 m')

assertEqual(String(call('1 meter 20 cm * 2').toSI()), '2.4 m')
assertEqual(String(call('1 meter 20 cm + 2m 50 cm * 3').toSI()), '8.7 m')

assertEqual(String(call('1 kg 300 gram / -2').toSI()), '-0.65 kg')

assertEqual(String(call('1 m 70 cm + 1 ft').toSI().value), 2.0048, ALMOST)

assertEqual(String(call('0.1km 11m 11 cm + 0.5 * 2 km 2 mm').toSI().value), 1111.111, ALMOST)

//money
assertEqual(call('10 USD'), '10 USD')
assertEqual(call('10 usd'), '10 USD')

assertEqual(call('10 Euro'), '10 EUR')
assertEqual(call('€ 10'), '10 EUR')
assertEqual(call('Eur10'), '10 EUR')
assertEqual(call('eUro10'), '10 EUR')

// different writing forms
assertEqual(call('12.34 ₴'), '12.34 UAH')
assertEqual(call('12.34₴'), '12.34 UAH')
assertEqual(call('₴12.34'), '12.34 UAH')
assertEqual(call('₴ 12.34'), '12.34 UAH')
assertEqual(call('uAh12.34'), '12.34 UAH')
assertEqual(call('uAh 12.34'), '12.34 UAH')
assertEqual(call('12.34uAh'), '12.34 UAH')
assertEqual(call('12.34 uAh'), '12.34 UAH')
assertEqual(call('₴ 12.34 uaH'), '12.34 UAH')
assertEqual(call('₴12.34uaH'), '12.34 UAH')


assertEqual(call('2.5 $'), '2.5 USD')
assertEqual(call('$ 2.5'), '2.5 USD')
assertEqual(call('2.5 ₴'), '2.5 UAH')
assertEqual(call('₴ 2.5'), '2.5 UAH')
assertEqual(call('UAH 2.5'), '2.5 UAH')


assertEqual(call('-10 USD'), '-10 USD')

assertEqual(call('3 USD + 2 USD'), '5 USD')

assertEqual(call('$8 / 2'), '4 USD')
assertEqual(call('(5+3)$'), '8 USD')

assertEqual(call('-2.5 USD + $3.1 +(1/2)usd'), '1.1 USD')

try {
  call('2 kg + 4 USD')
} catch(e) {
  assertEqual(e.message, 'Units do not match')
}

assertEqual(call('4 UAH  2'), '8 UAH')


try {
  call('2 GBP ^ 2')   // cannot exponent units
} catch(e) {
  assert(e.message.includes('Unexpected'))
}

// negative units
assertEqual(call('-2 UAH - (-3UAH)'), '1 UAH')


try {
  call('2 UAH << 2 ')
} catch(e) {
  assert(e.message.includes('Unexpected'))
}

try {
  call('12 / 2UAH ')
} catch(e) {
  assert(e.message.includes('Empty result'))
}

assertEqual(call('(3+5) 2 Euro * 2'), '32 EUR')

assertEqual(call('1 UAH * pi').toNumber(), 3.14, ALMOST)


// mixed currencies
assertEqual(call('1 USD + 1 TENDOLL').toNumber('USD'), 11)
assertEqual(call('1 TENDOLL + 1 USD').toNumber('USD'), 11)
assertEqual(call('1 ZUAH + 1 USD + 1 ZEUR').toNumber('ZUAH'), 1 + 28 + 28*1.1, ALMOST)
assertEqual(call('(1 USD)2 + 1 ZEUR').value, 1*2 + 1.1)
assertEqual(call('1 USD + 1 EUR').value, call('1 EUR + 1 USD').value, ALMOST)


// rates checks
//console.log('rcd:', rates['CAD'])
assertEqual(call('$1 CAD').toNumber('USD'), rates['CAD'])
assertEqual(call('$1 CAD + 1 EUR ').toNumber('USD'),
            rates['CAD'] + rates['EUR'], ALMOST)


// implicit conversion: "number ± unit" treat as "unit ± unit"
assertEqual(call('3 USD + 2'), '5 USD')
assertEqual(call('3 + 2 USD'), '5 USD')
assertEqual(call('3 - 1 cad').toNumber('CAD'), 2, ALMOST)
assertEqual(call('3 CAD - 1').toNumber('CAD'), 2, ALMOST)


// units conversion
assertEqual(call('1 kg to gram'), '1000 gram')
assertEqual(call('0.4 + 0.6 inch to cm'), '2.54 cm')
assertEqual(call('4.5 kg to gram'), '4500 gram')
assertEqual(call('3(4km - 2000 m / 2) /200 to dm'), '450 dm')
assertEqual(call('1 yard into cm'), '91.44 cm')
assertEqual(call('2 * 2 ft as mm'), '1219.2 mm')
assertEqual(call('0 degC to K'), '273.15 K')



// money conversion (used z-prefixes artifictial fixed-rate currencies for testing)
assertEqual(call('1 ZUSD to ZUAH'), '28 ZUAH')
assertEqual(call('0.4 + 0.6 ZEUR in ZUSD'), '1.1 ZUSD')
assertEqual(call('110 USD to ZEUR').toNumber('ZEUR'), 100, ALMOST)
assertEqual(call('56 ZUAH in ZUSD').toNumber('ZUSD'), 2, ALMOST)
assertEqual(call('56 ZUAH into ZUSD').toNumber('ZUSD'), 2, ALMOST)

// %: simple operations
assertEqual(call('10 %'), '10 PERCENT')
assertEqual(call('3%+2'), '5 PERCENT')  //implicit conversion
assertEqual(call('10% + 5%'), '15 PERCENT')
assertEqual(call('-3%+5 %').toNumber('PERCENT'), 2, ALMOST)
assertEqual(call('7% / 2'), '3.5 PERCENT')

// % operations (by sheet order)
assertEqual(call('2%+3%'), '5 PERCENT')
assertEqual(call('2% - 3%'), '-1 PERCENT')
assertEqual(call('2% + 5'), '7 PERCENT')
assertEqual(call('200 + 3%'), 206)
assertEqual(call('200 - 3%'), 194)
assertEqual(call('2% - 5'), '-3 PERCENT')
assertEqual(call('300% - 6'), '294 PERCENT')

try {
  call('6% + 3cm')
} catch(e) {
  assert(e.message.includes('Empty result'))
}

assertEqual(call('400 km + 5%'), '420 km')

try {
  call('7% + 3kg')
} catch(e) {
  assert(e.message.includes('Empty result'))
}

assertEqual(call('500 kg - 120%'), '-100 kg')


// random complex operations with %
assertEqual(call('(3%+2%) (1 +1)'), '10 PERCENT')

// TODO: mul& div with percents
assertEqual(call('200 * 10%'), 20)

assertEqual(call('200 / 5%'), 4000 )
// 
assertEqual(call('200% * 2'), '400 PERCENT')
assertEqual(call('-100% * 3'), '-300 PERCENT')

assertEqual(call('200kg * 10%'), '20 kg')
assertEqual(call('200kg / 5%').to('kg'), '4000 kg')


// Tests from Specification
assertEqual(call('8 times 9'), 72)
assertEqual(call('1 meter 20 cm'), '1.2 meter')
assertEqual(call('6(3)'), 18)
assertEqual(call('$30 CAD + 5 USD - 7EUR').toNumber('USD'),
            30 * rates['CAD'] + 5 - 7 * rates['EUR'], ALMOST)
assertEqual(call(`${1/rates['RUB']} roubles - 1 $`).toNumber('USD'), 0, ALMOST)
assertEqual(call('20% of 10$'), '2 USD')
assertEqual(call('5% on $30'), '31.5 USD')
assertEqual(call('6% off 40 EUR'), '37.6 EUR')
assertEqual(call('50$ as a % of 100$'), '50 PERCENT')
assertEqual(call('50$ as a % of 100$'), '50 PERCENT')
assertEqual(call('50 kg as a % of 1 tonne'), '5 PERCENT')
assertEqual(call('$70 as a % on $20'), '250 PERCENT')
assertEqual(call('$20 as a % off $70').value, 28.57, ALMOST) // 20/0.7
assertEqual(call('5% of what is 6 EUR').toNumber('USD'), 0.3, ALMOST)
assertEqual(call('5% on what is 6 EUR').toNumber('EUR'), 6.3, ALMOST)
assertEqual(call('5% off what is 6 EUR').toNumber('EUR'), 5.7, ALMOST)

// Scales
assertEqual(call('4k'), 4000)
assertEqual(call('-1000 + 4.5k + 1000'), 4500)
assertEqual(call('1.5thousand'), 1500)
assertEqual(call('5M'), 5000000)
assertEqual(call('6 billion'), 6000000000)
assertEqual(call('1k-4M'), -3999000)
assertEqual(call('1000k - 1M'), 0)

assertEqual(call('2k K').toString(), '2000 K') // 2k Kelvins
assertEqual(call('$2k').toString(), '2000 USD')
assertEqual(call('2M eur').toNumber('EUR'), 2000000)

assertEqual(call('2k mm + 2m').toString(), '4 m')

assertEqual(call('$2.2k in ZEUR').toNumber('ZEUR'), 2000, ALMOST)

console.log('tests passed')

function runmath(s) {
   var ans;
  try {// We want to catch parse errors and die appropriately

    // Make a parser and feed the input
    //console.log('Initial', grammar.ParserRules, grammar.ParserStart, s )
    //ans = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(s);

    // let verbose = false      // hack for debugging
    // if (s[0] === '!') {
    //   s = s.slice(1)
    //   verbose = true
    // }

    ans = call(s, DEBUG)

    if (isUnit(ans)) {
      console.log([ans.clone().toNumber(), ans.clone().format({notation: 'fixed', precision:2}), ans.clone().toString()].join('/'))
    }

    return ans
  } catch(e) {
    console.log('error:', e)
    if (e.offset) {
      // Panic in style, by graphically pointing out the error location.
      var out = new Array(PROMPT.length + e.offset + 1).join("-") + "^  Error.";
      //                                  --------
      //                                         ^ This comes from nearley!
      return out;
    } else {
      console.log(e)
    }
  }
}

// node readline gunk. Nothing too exciting.
let readline = require('readline')

// quick solution
if (readline.createInterface !== undefined) {
  let rl = readline.createInterface(process.stdin, process.stdout);

  rl.setPrompt(PROMPT);
  rl.prompt();

  rl.on('line', function(line) {
    console.log(runmath(line));
    rl.prompt();
  }).on('close', function() {
    //console.log('\nBye.');
    process.exit(0);
  });
}

module.exports = { runmath, prepareAndParse }
