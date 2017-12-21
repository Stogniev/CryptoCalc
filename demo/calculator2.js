// This is an example of how to use a nearley-made grammar.
var PROMPT = "> ";
var nearley = require("nearley");
var grammar = require("./grammar2.js");
let assert = require('assert')

function assertEqual(a, b, almost=false) {
  try {
    assert(almost ? Math.abs(a - b) < 0.1 : a === b)
  } catch (e) {
    console.warn(`"${a}" !=\n"${b}"`)
    throw e
  }
}

const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']


// magically adapting text for grammar parser
function prepareTxt(txt, verbose=false) {
  const txt0 = txt

  // 1. Add spaces around braces except standard functions

  // 1.1.  add spaces around ALL braces   2(3+4) => 2 (3 + 4)
  //txt = txt.replace(new RegExp('([\(\)])', 'gi'), ' $1 ')
  txt = txt.replace(new RegExp('\\s*([\(\)])\\s*', 'gi'), ' $1 ')

  //
  // 1.2 Shift functions to their braces (to avoid confusion with multiplication to variable)
  // Example: "sin (...)" => "sin(...)"
  const st = StandartFunctions.join('|')  // 'sin|cos|tag|asin|acos|atan|sqrt|ln'
  //txt = txt.replace(new RegExp(`(${st})\s+`, 'gi'), ' $1')
  txt = txt.replace(new RegExp(`(\\W+|^)(${st})\\s*\\(`, 'gi'), '$1$2(')

  if (verbose) console.log(`${txt0} -p-> ${txt}`)

  return txt
}

// test prepareTxt
// assertEqual(prepareTxt('sin (x)+ 3(4-3) - cos(x)/2(4+8) -blasin(4+3)'),
//                        'sin( x ) + 3 ( 4-3 ) - cos( x ) /2 ( 4+8 ) -blasin ( 4+3 ) ')


function call(txt, verbose=false) {
  txt = prepareTxt(txt, verbose)

  let ans = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(txt);

  if (ans.results.length > 1) {
    console.warn(`Multiple results for "${txt}": ${ans.results}`)
  }

  if (verbose) {
    console.log(`${txt} -c-> ${ans.results}`)
  }

  return ans.results[0]
}


// NOTES:
// 1. put space before and after braces
// 2. not put space before standart functions call sin(1)











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


// units, money
//TODO


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
    ans = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(s);
    //console.log("parser table:", table);
    //console.log('RR:', ans)
    
    // Check if there are any results
    if (ans.results.length) {
      //console.log('RRR:',ans)
      return ans.results[0].toString();
    } else {
      // This means the input is incomplete.
      var out = "Error: incomplete input, parse failed. :(";
      return out;
    }
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
  console.log('\nBye.');
  process.exit(0);
});
