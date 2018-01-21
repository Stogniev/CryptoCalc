// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

  const math = require("mathjs");

  function log() {
    if (process.env.DEBUG) {
      console.log('-',Object.values(arguments))
    }
  }

  const common = require('./common')

  function getUnitName(u) {
    return u.units[0].prefix.name + u.units[0].unit.name
  }

  function isUnit(x) {
    return x instanceof math.type.Unit
  }

  function isPercent(x) {
    return isUnit(x) && getUnitName(x) === 'PERCENT'
  }

  function isMeasure(x) {
    return isUnit(x) && !isPercent(x)
  }

  function isNumber(x) {
    return typeof(x) === 'number'
  }

  // convert n to baseUnit unit
  function toUnit(n, baseUnit) {
    return math.unit(n, getUnitName(baseUnit))
  }

  // magic sum: "Number/Unit ± Unit" treat as "Unit ± Unit"
  function magicSum(a, b, operation, reject) {
    let operands = [a, b]
    let unitName = null, numberIndex = null;
    let numberCount = 0

    for (let [i, x] of operands.entries()) {
      if (isNumber(x)) {
        numberIndex = i
        numberCount++
      } else if (isUnit(x)) {
        unitName = x.units[0].unit.name
      } else {
        return reject
      }
    }
    if (unitName === null || numberCount > 1 /*|| numberIndex === null*/)  return reject;

    if (numberIndex !== null) {
      operands[numberIndex] = math.unit(operands[numberIndex], unitName)
    }

    let r = operation(...operands)
    log('magicSum:', operation.name, a, b, r)
    return r
  }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["_", "OPS", "_"], "postprocess": function(d) { log('>',d, typeof d[1]); return d[1]; }},
    {"name": "OPS", "symbols": ["OPS_NUM"], "postprocess": id},
    {"name": "OPS", "symbols": ["OPS_UNIT"], "postprocess": id},
    {"name": "OPS_NUM", "symbols": ["SHIFT"], "postprocess": id},
    {"name": "OPS_UNIT", "symbols": ["CONVERSION"], "postprocess": id},
    {"name": "CONVERSION", "symbols": ["AS_UNIT", "convert", "_", "unit"], "postprocess": (d,l,rej) => {log('convert:', d[0], d[3]); return d[0].to(d[3])}},
    {"name": "CONVERSION", "symbols": ["AS_UNIT"], "postprocess": id},
    {"name": "SHIFT", "symbols": ["SHIFT", "leftShift", "AS_NUM"], "postprocess": (d,l, rej) => d[0] << d[2]},
    {"name": "SHIFT", "symbols": ["SHIFT", "rightShift", "AS_NUM"], "postprocess": (d,l, rej) => d[0] >> d[2]},
    {"name": "SHIFT", "symbols": ["AS_NUM"], "postprocess": id},
    {"name": "AS_UNIT", "symbols": ["AS_MEASURE"], "postprocess": id},
    {"name": "AS_UNIT", "symbols": ["AS_PERCENT"], "postprocess": id},
    {"name": "AS_MEASURE", "symbols": ["AS_NUM", "plus", "AS_MEASURE"], "postprocess": (d,l,rej) => math.add(toUnit(d[0], d[2]), d[2])},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "plus", "MD_NUM"], "postprocess": (d,l,rej) => math.add(d[0], toUnit(d[2], d[0]))},
    {"name": "AS_MEASURE", "symbols": ["AS_NUM", "minus", "AS_MEASURE"], "postprocess": (d,l,rej) => math.subtract(toUnit(d[0], d[2]), d[2])},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "minus", "MD_NUM"], "postprocess": (d,l,rej) => math.subtract(d[0], toUnit(d[2], d[0]))},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "plus", "MD_MEASURE"], "postprocess": (d,l,rej) => math.add(d[0], d[2])},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "minus", "MD_MEASURE"], "postprocess": (d,l,rej) => math.subtract(d[0], d[2])},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "plus", "MD_PERCENT"], "postprocess":  ([u,,p], l, rej) => {
           log('m-%', u,p)
           u.value = u.value + u.value/100*p.toNumber()
           return u
        } },
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "minus", "MD_PERCENT"], "postprocess":  ([u,,p], l, rej) => {
           log('m-%', u,p)
           u.value = u.value - u.value/100*p.toNumber()
           return u
        } },
    {"name": "AS_MEASURE", "symbols": ["MD_MEASURE"], "postprocess": id},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "plus", "MD_PERCENT"], "postprocess": (d,l,rej) => math.add(d[0], d[2])},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "minus", "MD_PERCENT"], "postprocess": (d,l,rej) => math.subtract(d[0], d[2])},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "plus", "AS_NUM"], "postprocess": ([p,,n],l,rej) => math.add(p, toUnit(n, p))},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "minus", "AS_NUM"], "postprocess": ([p,,n],l,rej) => math.subtract(p, toUnit(n, p))},
    {"name": "AS_PERCENT", "symbols": ["MD_PERCENT"], "postprocess": id},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "plus", "MD_NUM"], "postprocess": (d,l,rej) => math.add(d[0], d[2])},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "minus", "MD_NUM"], "postprocess": (d,l,rej) => math.subtract(d[0], d[2])},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "plus", "MD_PERCENT"], "postprocess": ([n,,p],l,rej) => math.add(n, n/100*p.toNumber())},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "minus", "MD_PERCENT"], "postprocess": ([n,,p],l,rej) => math.subtract(d[0], n/100*p.toNumber())},
    {"name": "AS_NUM", "symbols": ["MD_NUM"], "postprocess": id},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "mul", "SIGNED_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_NUM", "mul", "SIGNED_MEASURE"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "mul", "VALUE_PERCENT"], "postprocess": ([m,,p],l, rej) =>{log('m*p', m,p); return math.multiply(m, p.value/100) }},
    {"name": "MD_MEASURE$string$1", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$1", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p of m', p, m); return math.multiply(m, p.value/100) }},
    {"name": "MD_MEASURE$string$2", "symbols": [{"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$2", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p on m', p, m); return math.add(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE$string$3", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$3", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p off m', p, m); return math.subtract(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "divide", "VALUE_PERCENT"], "postprocess": ([m,,p],l, rej) => {log('m/p', m,p,p.value); return math.divide(m, p.value/100) }},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "__", "VALUE_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_NUM", "__", "VALUE_MEASURE"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "divide", "SIGNED_NUM"], "postprocess": (d,l, rej) => math.divide(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["SIGNED_MEASURE"], "postprocess": id},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "mul", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) => {log(`%*n`,p,n); return math.multiply(p, n)}},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "__", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) =>  math.multiply(p, n)},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "divide", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) => {log(`%/n`,p,n); return math.divide(p, n)}},
    {"name": "MD_PERCENT$string$1", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_MEASURE", "__", "MD_PERCENT$string$1", "__", "MD_MEASURE"], "postprocess": ([m1,,,,m2],l, rej) => {log('m1 as a % of m2', m1, m2); return math.unit(math.divide(m1, math.divide(m2, 100)), 'PERCENT') }},
    {"name": "MD_PERCENT", "symbols": ["SIGNED_PERCENT"], "postprocess": id},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mul", "E_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mul", "SIGNED_PERCENT"], "postprocess": ([n,,p],l,rej) => n * p.value/100},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "__", "E_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "divide", "E_NUM"], "postprocess": (d,l, rej) => math.divide(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "divide", "SIGNED_PERCENT"], "postprocess": ([n,,p],l,rej) => n / p.value*100},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mod", "E_NUM"], "postprocess": (d,l, rej) => math.mod(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["E_NUM"], "postprocess": id},
    {"name": "SIGNED_PERCENT", "symbols": ["SIGNED_UNIT"], "postprocess": (d,l, rej) => isPercent(d[0]) ? d[0] : rej},
    {"name": "SIGNED_MEASURE", "symbols": ["SIGNED_UNIT"], "postprocess": (d,l, rej) => isMeasure(d[0]) ? d[0] : rej},
    {"name": "VALUE_MEASURE", "symbols": ["VALUE_UNIT"], "postprocess": (d,l, rej) => isMeasure(d[0]) ? d[0] : rej},
    {"name": "VALUE_PERCENT", "symbols": ["VALUE_UNIT"], "postprocess": (d,l, rej) => isPercent(d[0]) ? d[0] : rej},
    {"name": "E_NUM", "symbols": ["SIGNED_NUM", "exp", "E_NUM"], "postprocess": (d,l,rej) => Math.pow(d[0], d[2])},
    {"name": "E_NUM", "symbols": ["SIGNED_NUM"], "postprocess": id},
    {"name": "SIGNED_NUM", "symbols": ["__", {"literal":"+"}, "_", "VALUE_NUM"], "postprocess": function(d) { /*log('value_num+');*/ return d[3]; }},
    {"name": "SIGNED_NUM", "symbols": ["__", {"literal":"-"}, "_", "VALUE_NUM"], "postprocess": function(d) { /*log('value_num-');*/ return math.multiply(-1, d[3]) }},
    {"name": "SIGNED_NUM", "symbols": ["VALUE_NUM"], "postprocess": function(d) {/*log('value_num:', d[0]);*/ return d[0]; }},
    {"name": "SIGNED_UNIT", "symbols": ["__", {"literal":"+"}, "_", "VALUE_UNIT"], "postprocess": function(d) { log('u+'); return d[3]; }},
    {"name": "SIGNED_UNIT", "symbols": ["__", {"literal":"-"}, "_", "VALUE_UNIT"], "postprocess": function(d) { log('u-'); return math.multiply(-1, d[3]) }},
    {"name": "SIGNED_UNIT", "symbols": ["VALUE_UNIT"], "postprocess": function(d) {log('value+unit:', d[0]); return d[0]; }},
    {"name": "VALUE_NUM", "symbols": ["P_NUM"], "postprocess": id},
    {"name": "VALUE_NUM", "symbols": ["N"], "postprocess": id},
    {"name": "VALUE_UNIT", "symbols": ["P_UNIT"], "postprocess": id},
    {"name": "VALUE_UNIT", "symbols": ["VALUE_UNIT", "__", "VALUE_NUM", "_", "unit"], "postprocess":  // example: "1m 20 cm 30 mm"
         function(d,l, reject) {
           let u1 = d[0]
           let u2
        
           try {
             log('value with unit:', d[2], d[4]);
             u2 = math.unit(d[2], d[4])
           } catch(e) {
             //console.warn('no unit:', e.message)
             return reject
           }
        
           if (u1.equalBase(u2)) {
             return math.sum(u1, u2)
           }
        
           // not the case of same base unit
           return reject;
        }
               },
    {"name": "VALUE_UNIT", "symbols": ["VALUE_NUM", "_", "unit"], "postprocess": 
         function(d,l, reject) {
           try {
             log('value with unit:', d[0], d[2]);
             return math.unit(d[0], d[2])
           } catch(e) {
             //console.warn('no unit:', e.message)
             return reject
           }
        
           // not the case of same base unit
           // return reject;
        }
               },
    {"name": "P_NUM", "symbols": [{"literal":"("}, "_", "OPS_NUM", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "P_UNIT", "symbols": [{"literal":"("}, "_", "OPS_UNIT", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "FUNC$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$1", "P_NUM"], "postprocess": function(d) {return Math.sin(d[1]); }},
    {"name": "FUNC$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$2", "P_NUM"], "postprocess": function(d) {return Math.cos(d[1]); }},
    {"name": "FUNC$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$3", "P_NUM"], "postprocess": function(d) {return Math.tan(d[1]); }},
    {"name": "FUNC$string$4", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$4", "P_NUM"], "postprocess": function(d) {return Math.asin(d[1]); }},
    {"name": "FUNC$string$5", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$5", "P_NUM"], "postprocess": function(d) {return Math.acos(d[1]); }},
    {"name": "FUNC$string$6", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$6", "P_NUM"], "postprocess": function(d) {return Math.atan(d[1]); }},
    {"name": "FUNC$string$7", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$7", "P_NUM"], "postprocess": function(d) {return Math.sqrt(d[1]); }},
    {"name": "FUNC$string$8", "symbols": [{"literal":"l"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$8", "P_NUM"], "postprocess": function(d) {return Math.log(d[1]); }},
    {"name": "CONST$string$1", "symbols": [{"literal":"p"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CONST", "symbols": ["CONST$string$1"], "postprocess": function(d) {return Math.PI; }},
    {"name": "CONST", "symbols": [{"literal":"e"}], "postprocess": function(d) {return Math.E; }},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N", "symbols": ["FUNC"], "postprocess": id},
    {"name": "N", "symbols": ["CONST"], "postprocess": id},
    {"name": "N", "symbols": ["ident"], "postprocess": 
        function(d, l, reject) {
          if (['sin', 'cos', 'tan', 'pi', 'e', 'asin', 'acos', 'atan', 'ln', 'sqrt'
              ].includes(d[0])) {  //NOTE: put all identifiers
              //log('reject ident1');
              return reject;
          } else {
            if (false) {  // TODO: check/put variable here if exists
                //return variables(d[0])
            } else {
              //log('reject ident2')
              return reject;
            }
          }
        }
            },
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {log('int', d); return parseInt(d[0], 10)}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {/*log('int:', d[0].join(""));*/ return d[0].join(""); }},
    {"name": "ident$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ident", "symbols": ["ident$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "unit$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "unit$ebnf$1", "symbols": ["unit$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unit", "symbols": ["unit$ebnf$1", "separator"], "postprocess": 
        function(d, l, reject) {
          //const val = (d[0].concat(d[1])).join('').toLocaleLowerCase()
          const val = d[0].join('')
          log('u:', d, val)
        
          //  don't check unit correctness (assume math.js will)
         if (val === 'PERCENT') reject
        
        
          if (common.confusingUnits.includes(val)) {
            log('Denying confusing "${val}" unit')
            return reject
          }
        
          return val
        
        
          /*if (Units.includes(val)) {  //TODO: include all units (currensies etc)
                                         //log('unit ok:', val)
            return val
          } else {
            //log('rej unit:', val)
            return reject;
          }*/
        
        }
             },
    {"name": "separator", "symbols": [{"literal":";"}]},
    {"name": "plus", "symbols": ["_", {"literal":"+"}, "_"]},
    {"name": "plus$string$1", "symbols": [{"literal":"p"}, {"literal":"l"}, {"literal":"u"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["_", "plus$string$1", "_"]},
    {"name": "plus$string$2", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["_", "plus$string$2", "_"]},
    {"name": "plus$string$3", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "plus", "symbols": ["_", "plus$string$3", "_"]},
    {"name": "minus", "symbols": ["_", {"literal":"-"}, "_"]},
    {"name": "minus$string$1", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["_", "minus$string$1", "_"]},
    {"name": "minus$string$2", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"b"}, {"literal":"t"}, {"literal":"r"}, {"literal":"a"}, {"literal":"c"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["_", "minus$string$2", "_"]},
    {"name": "minus$string$3", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minus", "symbols": ["_", "minus$string$3", "_"]},
    {"name": "mul", "symbols": ["_", {"literal":"*"}, "_"]},
    {"name": "mul$string$1", "symbols": [{"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["_", "mul$string$1", "_"]},
    {"name": "mul$string$2", "symbols": [{"literal":"m"}, {"literal":"u"}, {"literal":"l"}, {"literal":"t"}, {"literal":"i"}, {"literal":"p"}, {"literal":"l"}, {"literal":"i"}, {"literal":"e"}, {"literal":"d"}, {"literal":" "}, {"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["_", "mul$string$2", "_"]},
    {"name": "mul$string$3", "symbols": [{"literal":"m"}, {"literal":"u"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mul", "symbols": ["_", "mul$string$3", "_"]},
    {"name": "divide", "symbols": ["_", {"literal":"/"}, "_"]},
    {"name": "divide$string$1", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "divide", "symbols": ["_", "divide$string$1", "_"]},
    {"name": "divide$string$2", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}, {"literal":" "}, {"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "divide", "symbols": ["_", "divide$string$2", "_"]},
    {"name": "divide$string$3", "symbols": [{"literal":"d"}, {"literal":"i"}, {"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}, {"literal":"d"}, {"literal":" "}, {"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "divide", "symbols": ["_", "divide$string$3", "_"]},
    {"name": "exp", "symbols": ["_", {"literal":"^"}, "_"]},
    {"name": "mod$string$1", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mod", "symbols": ["_", "mod$string$1", "_"]},
    {"name": "leftShift$string$1", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "leftShift", "symbols": ["_", "leftShift$string$1", "_"]},
    {"name": "rightShift$string$1", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rightShift", "symbols": ["_", "rightShift$string$1", "_"]},
    {"name": "convert$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "convert", "symbols": ["__", "convert$string$1", "__"]},
    {"name": "convert$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "convert", "symbols": ["__", "convert$string$2", "__"]},
    {"name": "convert$string$3", "symbols": [{"literal":"a"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "convert", "symbols": ["__", "convert$string$3", "__"]},
    {"name": "convert$string$4", "symbols": [{"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "convert", "symbols": ["__", "convert$string$4", "__"]},
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
