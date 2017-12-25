// This is an example of how to use a nearley-made grammar.
var PROMPT = "> ";
var nearley = require("nearley");
var grammar = require("./grammar2.js");
let assert = require('assert')
const math = require('mathjs')

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

// TODO: add all
const Units = ['cm', 'm', 'km', 'usd', 'uah',]

// magically adapting text for grammar parser
function prepareTxt(txt, verbose=false) {
  const txt0 = txt

  // 0) remove multispaces
  txt = txt.replace(new RegExp('\\s+', 'gi'), ' ')

  // 1) put spaces around all math braces
  //txt = txt.replace(new RegExp('([\(\)])', 'gi'), ' $1 ')
  txt = txt.replace(new RegExp('\\s*([\(\)])\\s*', 'gi'), ' $1 ')

  // 2) remove spaces between standard function calls braces likd "sin(...)" (to avoid confusion with multiplication to variable)
  // Example: "sin (...)" => "sin(...)"
  const st = StandartFunctions.join('|')  // 'sin|cos|tag|asin|acos|atan|sqrt|ln'
  //txt = txt.replace(new RegExp(`(${st})\s+`, 'gi'), ' $1')
  txt = txt.replace(new RegExp(`(\\W+|^)(${st})\\s*\\(`, 'gi'), '$1$2(')


  // 3) Add spaces before all +/- signs (to simplify unary/binary sign logic)
  txt = txt.replace(new RegExp(`\\s*([+-])`, 'gi'), ' $1')

  // NOTE: cannot lowercase to distinguish "mm" and "Mm"; no need to space to avoid confusions like "multiple" -> "m ultiple"
  // 4) wrap by space all units (USD, Gb, km...)
  //const units = Units.join('|')
  //txt = txt.replace(new RegExp(`(${units})`, 'gi'), '$1')

  if (verbose) console.log(`"${txt0}" -p-> "${txt}"`)

  return txt
}

// test prepareTxt
// assertEqual(prepareTxt('sin (x)+ 3(4-3) - cos(x)/2(4+8) -blasin(4+3)'),
//                        'sin( x ) + 3 ( 4-3 ) - cos( x ) /2 ( 4+8 ) -blasin ( 4+3 ) ')


function call(txt, verbose=false) {
  txt = prepareTxt(txt, verbose)

  if (verbose) console.log(`preparedTxt: "${txt}"`)

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
}


assertEqual(call('2 multiplied by 3'), 6)
assertEqual(call('1 and 2 * 3'), 7)


assertEqual(call('10'), 10)

// units
assertEqual(call('10 cm'), '10 cm')
assertEqual(call('-10 cm'), '-10 cm')

assertEqual(call('3 cm + 2 cm'), '5 cm')
//!!assertEqual(call('3 km + 2 m'), '3.002 km')

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


//assertEqual(call('2 tonne * 4 gram '), '6 kg^2')


//return

// simple expression
assertEqual(call('123'), 123)

// math expressions
assertEqual(call('3 + 2'), 5)

assertEqual(call('1 + 2 * 3'), 7)
assertEqual(call('1 + (2^3) - 2 * 3'), 3)

// math constants
assertEqual(call('pi'), 3.14, almost=true)
assertEqual(call('pi + 1'), 4.14, almost=true)
assertEqual(call('1 + pi'), 4.14, almost=true)

// implicit multiplication "*"
assertEqual(call('(3)7'), 21)
assertEqual(call('3(5-3)4'), 24)
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

// units, money
//TOOD assertEqual(call('10 USD'), '10-USD')


// % operations
//TODO


console.log('tests passed')

return

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
