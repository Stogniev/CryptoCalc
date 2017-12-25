// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

  const math = require("mathjs");
  // TODO: add all
  const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']

  // TODO: add all
  const Units = ['cm', 'm', 'km', 'usd', 'uah', 'kg', 'g']

  function l() {
    //console.log('-',Object.values(arguments))
  }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["_", "OPS", "_"], "postprocess": function(d) { return d[1]; }},
    {"name": "OPS", "symbols": ["SHIFT"], "postprocess": id},
    {"name": "SHIFT", "symbols": ["SHIFT", "leftShift", "AS"], "postprocess": function(d) {return d[0] << d[2]; }},
    {"name": "SHIFT", "symbols": ["SHIFT", "rightShift", "AS"], "postprocess": function(d) {return d[0] >> d[2]; }},
    {"name": "SHIFT", "symbols": ["AS"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "plus", "MD"], "postprocess":  function(d,l, reject) {
          //console.log(22,  d[0], d[2])
        
          // reject "3 cm + 2"
          if (d[0].constructor.name !== d[2].constructor.name) {  // ok?
            //console.log('incompatible sum:', d[0], d[2])
            return reject
          }
          //console.log('plus:', d[0], d[2])
          return math.add(d[0], d[2]);
        } },
    {"name": "AS", "symbols": ["AS", "minus", "MD"], "postprocess": function(d) {return d[0]-d[2]; }},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "mul", "E"], "postprocess": function(d) {/*l('mul');*/ return d[0]*d[2]; }},
    {"name": "MD", "symbols": ["MD", "__", "E"], "postprocess": function(d) {l('imul'); return d[0] * d[2]; }},
    {"name": "MD", "symbols": ["MD", "divide", "E"], "postprocess": function(d) {return d[0]/d[2]; }},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "E", "symbols": ["SIGNED", "exp", "E"], "postprocess": function(d) {return Math.pow(d[0], d[2]); }},
    {"name": "E", "symbols": ["SIGNED"], "postprocess": id},
    {"name": "SIGNED", "symbols": ["VALUE_WITH_UNIT"], "postprocess": function(d) {l('vwu', d[0]); return d[0]; }},
    {"name": "SIGNED", "symbols": ["__", {"literal":"+"}, "_", "VALUE_WITH_UNIT"], "postprocess": function(d) { l('u+'); return d[3]; }},
    {"name": "SIGNED", "symbols": ["__", {"literal":"-"}, "_", "VALUE_WITH_UNIT"], "postprocess": function(d) { l('u-'); return math.multiply(-1, d[3]) }},
    {"name": "VALUE_WITH_UNIT", "symbols": ["VALUE", "__", "unit"], "postprocess": 
        function(d,l, reject) {
             
          try {
            //console.log('value with unit:', math.unit(d[0], d[2]));
            return math.unit(d[0], d[2])
          } catch(e) {
            console.warn('no unit:', e.message)
            return reject
          }
        }
               },
    {"name": "VALUE_WITH_UNIT", "symbols": ["VALUE"], "postprocess": function(d) {l('just value:', d[0]); return d[0]; }},
    {"name": "VALUE", "symbols": ["P"], "postprocess": id},
    {"name": "VALUE", "symbols": ["N"], "postprocess": id},
    {"name": "P", "symbols": [{"literal":"("}, "_", "OPS", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "FUNC$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$1", "P"], "postprocess": function(d) {return Math.sin(d[1]); }},
    {"name": "FUNC$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$2", "P"], "postprocess": function(d) {return Math.cos(d[1]); }},
    {"name": "FUNC$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$3", "P"], "postprocess": function(d) {return Math.tan(d[1]); }},
    {"name": "FUNC$string$4", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$4", "P"], "postprocess": function(d) {return Math.asin(d[1]); }},
    {"name": "FUNC$string$5", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$5", "P"], "postprocess": function(d) {return Math.acos(d[1]); }},
    {"name": "FUNC$string$6", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$6", "P"], "postprocess": function(d) {return Math.atan(d[1]); }},
    {"name": "FUNC$string$7", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$7", "P"], "postprocess": function(d) {return Math.sqrt(d[1]); }},
    {"name": "FUNC$string$8", "symbols": [{"literal":"l"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$8", "P"], "postprocess": function(d) {return Math.log(d[1]); }},
    {"name": "CONST$string$1", "symbols": [{"literal":"p"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CONST", "symbols": ["CONST$string$1"], "postprocess": function(d) {return Math.PI; }},
    {"name": "CONST", "symbols": [{"literal":"e"}], "postprocess": function(d) {return Math.E; }},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N", "symbols": ["FUNC"], "postprocess": id},
    {"name": "N", "symbols": ["CONST"], "postprocess": id},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {/*l('int', d);*/ return parseInt(d[0])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {/*l('int:', d[0].join(""));*/ return d[0].join(""); }},
    {"name": "ident$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ident", "symbols": ["ident$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "unit$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "unit$ebnf$1", "symbols": ["unit$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unit", "symbols": ["unit$ebnf$1"], "postprocess": 
        function(d, l, reject) {
          //const val = (d[0].concat(d[1])).join('').toLocaleLowerCase()
          const val = d[0].join('')
          //console.log('u:', val)
        
          // problem:  1 and 2 m ultiplied by                  nUnexpected "u"
          //  don't check unit correctness (assume math.js will)
          // return val
        
        
          if (Units.includes(val)) {  //TODO: include all units (currensies etc)
                                         //console.log('unit ok:', val)
            return val
          } else {
            //console.log('rej unit:', val)
            return reject;
          }
        
        }
             },
    {"name": "plus", "symbols": ["_", {"literal":"+"}, "_"]},
    {"name": "plus$string$1", "symbols": [{"literal":"p"}, {"literal":"l"}, {"literal":"u"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["__", "plus$string$1", "__"]},
    {"name": "plus$string$2", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["__", "plus$string$2", "__"]},
    {"name": "plus$string$3", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["__", "plus$string$3", "__"]},
    {"name": "minus", "symbols": ["_", {"literal":"-"}, "_"]},
    {"name": "minus$string$1", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["__", "minus$string$1", "__"]},
    {"name": "minus$string$2", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"b"}, {"literal":"t"}, {"literal":"r"}, {"literal":"a"}, {"literal":"c"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["__", "minus$string$2", "__"]},
    {"name": "minus$string$3", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["__", "minus$string$3", "__"]},
    {"name": "mul", "symbols": ["_", {"literal":"*"}, "_"]},
    {"name": "mul$string$1", "symbols": [{"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["__", "mul$string$1", "__"]},
    {"name": "mul$string$2", "symbols": [{"literal":"m"}, {"literal":"u"}, {"literal":"l"}, {"literal":"t"}, {"literal":"i"}, {"literal":"p"}, {"literal":"l"}, {"literal":"i"}, {"literal":"e"}, {"literal":"d"}, {"literal":" "}, {"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["__", "mul$string$2", "__"]},
    {"name": "mul$string$3", "symbols": [{"literal":"m"}, {"literal":"u"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["__", "mul$string$3", "__"]},
    {"name": "divide", "symbols": ["_", {"literal":"/"}, "_"]},
    {"name": "divide$string$1", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "divide", "symbols": ["__", "divide$string$1", "__"]},
    {"name": "divide$string$2", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}, {"literal":" "}, {"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "divide", "symbols": ["__", "divide$string$2", "__"]},
    {"name": "exp", "symbols": ["_", {"literal":"^"}, "_"]},
    {"name": "leftShift$string$1", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "leftShift", "symbols": ["_", "leftShift$string$1", "_"]},
    {"name": "rightShift$string$1", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rightShift", "symbols": ["_", "rightShift$string$1", "_"]},
    {"name": "modulo$string$1", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modulo", "symbols": ["__", "modulo$string$1", "__"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null; }},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null; }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.arithmetic = grammar;
}
})();
