// This is an example of how to use a nearley-made grammar.
var PROMPT = '> '
var nearley = require("nearley");
var grammar = require("./grammar2.js");
let assert = require('assert')
const math = require('mathjs')
var escape = require('regexp.escape');

const DEBUG = process.env.DEBUG
const Currencies = require('./currencies')

const Rates = require('./rates')

// TODO: process "$100" additionally to "100$"
// create currency units

// "default" dollar - dollar USA
math.createUnit('USD', {aliases: ['$']});
math.createUnit('cent', {definition: '0.01 USD', aliases: ['¢', 'c']});



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
function prepareTxt(txt, verbose=false) {
  const txt0 = txt

  // 0) remove multispaces
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')

  // 1) put spaces around all math braces (to simplify implicit multiplication grammar)
  //txt = txt.replace(new RegExp('([\(\)])', 'gi'), ' $1 ')
  txt = txt.replace(new RegExp('\\s*([\(\)])\\s*', 'gi'), ' $1 ')

  // 2) remove spaces between standard function calls braces likd "sin(...)" (to avoid confusion with multiplication to variable)
  // Example: "sin (...)" => "sin(...)"
  const st = StandartFunctions.join('|')  // 'sin|cos|tag|asin|acos|atan|sqrt|ln'
  //txt = txt.replace(new RegExp(`(${st})\s+`, 'gi'), ' $1')
  txt = txt.replace(new RegExp(`(\\W+|^)(${st})\\s*\\(`, 'gi'), '$1$2(')


  // 3) Add spaces before all +/- signs (to simplify unary/binary sign logic)
  txt = txt.replace(new RegExp(`\\s*([+-])`, 'gi'), ' $1')

  // 4) wrap all units (USD, Gb, kg...) by semicolon: " kg;"
  //    reason: to parse '10 cm' and same time avoid word cropping "1 and 2 m"ul 3
  const UP = UnitPrefixes.map( v => escape(v) ).join('|')
  const UN = UnitNames.map( v => escape(v) ).join('|')
  // console.log('UP', UP)
  // console.log('UN', UN)
  txt = txt.replace(new RegExp(`([^a-zA-Z])(${UP})(${UN})((?:[^a-zA-Z]|$))`, 'gi'), '$1 $2$3; $4')

  // remove multispace (produced user, 4)) reason: to avoid multiresults
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')


  if (verbose || DEBUG) console.log(`"${txt0}" -p-> "${txt}"`)

  return txt
}

// test prepareTxt
// assertEqual(prepareTxt('sin (x)+ 3(4-3) - cos(x)/2(4+8) -blasin(4+3)'),
//                        'sin( x ) + 3 ( 4-3 ) - cos( x ) /2 ( 4+8 ) -blasin ( 4+3 ) ')


function call(txt, verbose=false) {
  txt = prepareTxt(txt, verbose)

  verbose = verbose || DEBUG

  try {
  let ans = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(txt);

  //console.log('ans:', ans)
  if (ans.results.length > 1) {
    console.warn(`Multiple result for "${txt}": ${ans.results}`)
  }

  if (ans.results.length === 0) {
    throw new Error(`Empty result for "${txt}"`)
  }

  if (verbose) {
    console.log(`"${txt}" -c-> "${ans.results}"`)
  }

  return ans.results[0]

  } catch(e) {
    if (verbose) {
      console.log(`"${txt}" -E-> "${e.message}"`)
    }
    throw e
  }
}


// mini-sandbox
//
// return

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
assertEqual(call('e'), 2.7, almost=true)
assertEqual(call('pi'), 3.14, almost=true)
assertEqual(call('pi + 1'), 4.14, almost=true)
assertEqual(call('1 + pi'), 4.14, almost=true)

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

assertEqual(call('3.139 * 1'), 3.14, almost=true)  //to constants
assertEqual(call('pi (7 - 5) - pi'), 3.14, almost=true)  //to constants
assertEqual(call('pi(7 - 5)pi/(pi*pi) - 2'), 0)

// exponents
assertEqual(call('2^3'), 8)
assertEqual(call('2^3^2'), 512)
assertEqual(call('(2^3)^2'), 64)
assertEqual(call('2*3^2*3'), 54)
assertEqual(call('2 * 3 ^ 2 * 3'), 54)
assertEqual(call('2 * pi ^ 2 * 3'), 59.15, almost=true)
// exponent + braces
assertEqual(call('2^2(3)'), 12)
assertEqual(call('(3)2^2'), 12, almost=true)
assertEqual(call('(2)pi^2(3)'), 59.15, almost=true)
assertEqual(call('4^-2'), 4 ** -2, )



// word-described math expressions
assertEqual(call('3 + 2'), 5)

assertEqual(call('1 and 2 multiplied by 3'), 7)
assertEqual(call('(1 and 2) multiplied by 3'), 9)
assertEqual(call('1 with 62 without 2 times 3'), 57)
assertEqual(call('4 mul 2 + 3 ^ 2'), 17, almost=true)
assertEqual(call('18 divide by 2 multiplied by 2 ^ 2'), 36)

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

assertEqual(call('sin(2 pi)'),  call('2 sin(pi) cos(pi)'), almost=true)
assertEqual(call('tan(3 pi)'),  call('sin(3 pi)/cos(3 pi)'), almost=true)
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
assertEqual(call('12.95 + 3.10'), 16.05, almost=true)

// units
assertEqual(call('10 cm'), '10 cm')
assertEqual(call('-10 cm'), '-10 cm')

assertEqual(call('3 cm + 2 cm'), '5 cm')
assertEqual(call('3 km + 2m + 1  mm').value, 3002.001, almost=true)

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
  assert(e.message.includes('Unexpected'))
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
assertEqual(call('-2 m - (-3m)').value, 1, almost=true)


try {
  call('2 kg << 2 ')
} catch(e) {
  assert(e.message.includes('Unexpected'))
}

try {
  call('12 / 2kg ')
} catch(e) {
  assert(e.message.includes('Unexpected '))
}

assertEqual(call('(3+5) 2 kg * 2').value, 32)

// mixed subunits
assertEqual(String(call('1 meter 20 cm').toSI()), '1.2 m')
assertEqual(String(call('-1 meter 20 cm').toSI()), '-1.2 m')

assertEqual(String(call('1 meter 20 cm * 2').toSI()), '2.4 m')
assertEqual(String(call('1 meter 20 cm + 2m 50 cm * 3').toSI()), '8.7 m')

assertEqual(String(call('1 kg 300 gram / -2').toSI()), '-0.65 kg')

assertEqual(String(call('1 m 70 cm + 1 ft').toSI().value), 2.0048, almost=true)

assertEqual(String(call('0.1km 11m 11 cm + 0.5 * 2 km 2 mm').toSI().value), 1111.111, almost=true)




// Tests from Specification
assertEqual(call('8 times 9'), 72)
assertEqual(String(call('1 meter 20 cm').toSI()), '1.2 m')
assertEqual(call('6(3)'), 18)
// assertEqual(call(''), )
// assertEqual(call(''), )
// assertEqual(call(''), )
// assertEqual(call(''), )
// assertEqual(call(''), )
// assertEqual(call(''), )


//TODO money
assertEqual(call('10 USD'), '10 USD')
assertEqual(call('2.5 $'), '2.5 USD')


// % operations
//TODO


console.log('tests passed')

//return

// This is where the action is.
function runmath(s) {
  //console.log('s:', s)
  var ans;
  try {// We want to catch parse errors and die appropriately

    // Make a parser and feed the input
    //console.log('Initial', grammar.ParserRules, grammar.ParserStart, s )
    //ans = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(s);

    let verbose = false      // hack for debugging
    if (s[0] === '!') {
      s = s.slice(1)
      verbose = true
    }

    ans = call(s, verbose)
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
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(PROMPT);
rl.prompt();

rl.on('line', function(line) {
  console.log(runmath(line));
  rl.prompt();
}).on('close', function() {
  //console.log('\nBye.');
  process.exit(0);
});
