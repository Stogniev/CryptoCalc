// Generated automatically by nearley, version 2.11.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const math = require("mathjs");
  const { isUnit, isPercent, isMeasure, isNumber, /*isError,*/ toUnit, log } = require('../common')
  const { createUserVariable, validateVariableName } = require('./userVariables')
  const { getContext } = require('./parserContext')
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["line"], "postprocess": id},
    {"name": "line", "symbols": ["identifier", "_", {"literal":"="}, "EXPRESSION", "EOL"], "postprocess": 
        ([name,,,expression,],l,rej) => {
        
          try {
            validateVariableName(name)
          } catch(e) {
            return rej
          }
        
          return createUserVariable(name, expression)
        
          /*
          let v = setUserVariable(name, expression)
          return v  */
        }
             },
    {"name": "line", "symbols": ["EXPRESSION", "EOL"], "postprocess": ([expr,], l, rej) => { return expr }},
    {"name": "line", "symbols": ["_", "EOL"], "postprocess": (d,l,rej) => rej},
    {"name": "EXPRESSION", "symbols": ["_", "OPS", "_"], "postprocess":  function([,ops,]) {
          log('>', ops);
          return ops
        }   },
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
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "plus", "MD_MEASURE"], "postprocess": ([m1,,m2],l,rej) => math.add(m2, m1) /*last unit */},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "minus", "MD_MEASURE"], "postprocess": ([m1,,m2],l,rej) => math.add(math.multiply(-1, m2), m1)},
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "plus", "MD_PERCENT"], "postprocess":  ([u,,p], l, rej) => {
           log('m-%', u, p)
           let r = u.clone()
           r.value = u.value + u.value/100*p.toNumber()
           return r
        } },
    {"name": "AS_MEASURE", "symbols": ["AS_MEASURE", "minus", "MD_PERCENT"], "postprocess":  ([u,,p], l, rej) => {
           log('m-%', u,p)
           let r = u.clone()
           r.value = u.value - u.value/100*p.toNumber()
           return r
        } },
    {"name": "AS_MEASURE", "symbols": ["MD_MEASURE"], "postprocess": id},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "plus", "MD_PERCENT"], "postprocess": (d,l,rej) => math.add(d[0], d[2])},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "minus", "MD_PERCENT"], "postprocess": (d,l,rej) => math.subtract(d[0], d[2])},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "plus", "AS_NUM"], "postprocess": ([p,,n],l,rej) => math.add(p, toUnit(n, p))},
    {"name": "AS_PERCENT", "symbols": ["AS_PERCENT", "minus", "AS_NUM"], "postprocess": ([p,,n],l,rej) => math.subtract(p, toUnit(n, p))},
    {"name": "AS_PERCENT", "symbols": ["MD_PERCENT"], "postprocess": id},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "plus", "MD_NUM"], "postprocess": ([a,,b], l,rej) => math.add(a, b)},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "minus", "MD_NUM"], "postprocess": ([a,,b],l,rej) => math.subtract(a, b)},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "plus", "MD_PERCENT"], "postprocess": ([n,,p],l,rej) => math.add(n, n/100*p.toNumber())},
    {"name": "AS_NUM", "symbols": ["AS_NUM", "minus", "MD_PERCENT"], "postprocess": ([n,,p],l,rej) => math.subtract(n, n/100*p.toNumber())},
    {"name": "AS_NUM", "symbols": ["MD_NUM"], "postprocess": id},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "mul", "SIGNED_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_NUM", "mul", "SIGNED_MEASURE"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "mul", "VALUE_PERCENT"], "postprocess": ([m,,p],l, rej) =>{log('m*p', m,p); return math.multiply(m, p.value/100) }},
    {"name": "MD_MEASURE$string$1", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$1", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p of m', p, m); return math.multiply(m, p.value/100) }},
    {"name": "MD_MEASURE$string$2", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$2", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('% of what is m', p, m); return math.multiply(m, p.value/100) }},
    {"name": "MD_MEASURE$string$3", "symbols": [{"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$3", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p on m', p, m); return math.add(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE$string$4", "symbols": [{"literal":"o"}, {"literal":"n"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$4", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p onwhatis m', p, m); return math.add(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE$string$5", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$5", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p off m', p, m); return math.subtract(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE$string$6", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"f"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_MEASURE", "symbols": ["VALUE_PERCENT", "__", "MD_MEASURE$string$6", "__", "MD_MEASURE"], "postprocess": ([p,,,,m],l, rej) =>{log('p offwhatis m', p, m); return math.subtract(m, math.multiply(math.divide(m, 100), p.value)) }},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "divide", "VALUE_PERCENT"], "postprocess": ([m,,p],l, rej) => {log('m/p', m,p,p.value); return math.divide(m, p.value/100) }},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "__", "VALUE_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_NUM", "__", "VALUE_MEASURE"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["MD_MEASURE", "divide", "SIGNED_NUM"], "postprocess": (d,l, rej) => math.divide(d[0], d[2])},
    {"name": "MD_MEASURE", "symbols": ["SIGNED_MEASURE"], "postprocess": id},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "mul", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) => {log(`%*n`,p,n); return math.multiply(p, n)}},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "__", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) =>  math.multiply(p, n)},
    {"name": "MD_PERCENT", "symbols": ["MD_PERCENT", "divide", "VALUE_NUM"], "postprocess": ([p,,n],l, rej) => {log(`%/n`,p,n); return math.divide(p, n)}},
    {"name": "MD_PERCENT$string$1", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_NUM", "__", "MD_PERCENT$string$1", "__", "MD_NUM"], "postprocess": ([n1,,,,n2],l, rej) => {log('n1 as a % of n2', n1, n2); return math.unit(math.divide(n1, math.divide(n2, 100)), 'PERCENT') }},
    {"name": "MD_PERCENT$string$2", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_NUM", "__", "MD_PERCENT$string$2", "__", "MD_NUM"], "postprocess": ([n1,,,,n2],l, rej) => {log('n1 as a % on n2', n1, n2); return math.unit(math.divide(math.subtract(n1, n2), math.divide(n2, 100)), 'PERCENT')}},
    {"name": "MD_PERCENT$string$3", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"f"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_NUM", "__", "MD_PERCENT$string$3", "__", "MD_NUM"], "postprocess": ([n1,,,,n2],l, rej) => {log('n1 as a % off n2', n1, n2); return math.unit(math.divide(n1, math.divide(n2, 100)), 'PERCENT')}},
    {"name": "MD_PERCENT$string$4", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_MEASURE", "__", "MD_PERCENT$string$4", "__", "MD_MEASURE"], "postprocess": ([m1,,,,m2],l, rej) => {log('m1 as a % of m2', m1, m2); return math.unit(math.divide(m1, math.divide(m2, 100)), 'PERCENT') }},
    {"name": "MD_PERCENT$string$5", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_MEASURE", "__", "MD_PERCENT$string$5", "__", "MD_MEASURE"], "postprocess": ([m1,,,,m2],l, rej) => {log('m1 as a % on m2', m1, m2); return math.unit(math.divide(math.subtract(m1, m2), math.divide(m2, 100)), 'PERCENT')}},
    {"name": "MD_PERCENT$string$6", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"a"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}, {"literal":"f"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_PERCENT", "symbols": ["MD_MEASURE", "__", "MD_PERCENT$string$6", "__", "MD_MEASURE"], "postprocess": ([m1,,,,m2],l, rej) => {log('m1 as a % off m2', m1, m2); return math.unit(math.divide(m1, math.divide(m2, 100)), 'PERCENT')}},
    {"name": "MD_PERCENT", "symbols": ["SIGNED_PERCENT"], "postprocess": id},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mul", "E_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mul", "SIGNED_PERCENT"], "postprocess": ([n,,p],l,rej) => n * p.value/100},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "__", "E_NUM"], "postprocess": (d,l, rej) => math.multiply(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "divide", "E_NUM"], "postprocess": (d,l, rej) => math.divide(d[0], d[2])},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "divide", "SIGNED_PERCENT"], "postprocess": ([n,,p],l,rej) => n / p.value*100},
    {"name": "MD_NUM", "symbols": ["MD_NUM", "mod", "E_NUM"], "postprocess": (d,l, rej) => math.mod(d[0], d[2])},
    {"name": "MD_NUM$string$1", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$1", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('p of n', p, n); return math.multiply(n, p.value/100) }},
    {"name": "MD_NUM$string$2", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$2", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('% of what is n', p, n); return math.multiply(n, p.value/100) }},
    {"name": "MD_NUM$string$3", "symbols": [{"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$3", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('p on n', p, n); return math.add(n, math.multiply(math.divide(n, 100), p.value)) }},
    {"name": "MD_NUM$string$4", "symbols": [{"literal":"o"}, {"literal":"n"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$4", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('p onwhatis n', p, n); return math.add(n, math.multiply(math.divide(n, 100), p.value)) }},
    {"name": "MD_NUM$string$5", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$5", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('p off n', p, n); return math.subtract(n, math.multiply(math.divide(n, 100), p.value)) }},
    {"name": "MD_NUM$string$6", "symbols": [{"literal":"o"}, {"literal":"f"}, {"literal":"f"}, {"literal":"w"}, {"literal":"h"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "MD_NUM", "symbols": ["VALUE_PERCENT", "__", "MD_NUM$string$6", "__", "MD_NUM"], "postprocess": ([p,,,,n],l, rej) =>{log('p offwhatis n', p, n); return math.subtract(n, math.multiply(math.divide(n, 100), p.value)) }},
    {"name": "MD_NUM", "symbols": ["E_NUM"], "postprocess": id},
    {"name": "SIGNED_PERCENT", "symbols": ["SIGNED_UNIT"], "postprocess": (d,l, rej) => isPercent(d[0]) ? d[0] : rej},
    {"name": "SIGNED_MEASURE", "symbols": ["SIGNED_UNIT"], "postprocess": (d,l, rej) => isMeasure(d[0]) ? d[0] : rej},
    {"name": "VALUE_MEASURE", "symbols": ["VALUE_UNIT"], "postprocess": (d,l, rej) => isMeasure(d[0]) ? d[0] : rej},
    {"name": "VALUE_PERCENT", "symbols": ["VALUE_UNIT"], "postprocess": (d,l, rej) => isPercent(d[0]) ? d[0] : rej},
    {"name": "E_NUM", "symbols": ["SIGNED_NUM", "exp", "E_NUM"], "postprocess": (d,l,rej) => Math.pow(d[0], d[2])},
    {"name": "E_NUM", "symbols": ["SIGNED_NUM"], "postprocess": id},
    {"name": "SIGNED_NUM", "symbols": ["__", {"literal":"+"}, "_", "VALUE_NUM"], "postprocess": function([,,,n]) { /*log('value_num+');*/ return n; }},
    {"name": "SIGNED_NUM", "symbols": ["__", {"literal":"-"}, "_", "VALUE_NUM"], "postprocess": function([,,,n]) { /*log('value_num-');*/ return math.multiply(-1, n) }},
    {"name": "SIGNED_NUM", "symbols": ["VALUE_NUM"], "postprocess": function(d) {/*log('value_num:', d[0]);*/ return d[0]; }},
    {"name": "SIGNED_UNIT", "symbols": ["__", {"literal":"+"}, "_", "VALUE_UNIT"], "postprocess": function(d) { log('u+'); return d[3]; }},
    {"name": "SIGNED_UNIT", "symbols": ["__", {"literal":"-"}, "_", "VALUE_UNIT"], "postprocess": function(d) { log('u-'); return math.multiply(-1, d[3]) }},
    {"name": "SIGNED_UNIT", "symbols": ["VALUE_UNIT"], "postprocess": function(d) {log('value+unit:', d[0]); return d[0]; }},
    {"name": "VARIABLE", "symbols": ["identifier"], "postprocess":  ([name],l,rej) => {
          //113
        
          //console.log('V?', name)
          let v
          if (name === 'prev') {
            v = getContext().prev
        
          } else {
            v = getContext().userVariables[name]
          }
        
          log('V:', v)
          return v || rej
        
          //112 const r = userVariables.find( x => (x.name === name) ) || rej
          //log('VARIABLE', name, userVariables, r)
          //112 return r
        }  },
    {"name": "VARIABLE_UNIT", "symbols": ["VARIABLE"], "postprocess": ([variable],l,rej) => isUnit(variable.value) ? variable.value : rej},
    {"name": "VARIABLE_NUM", "symbols": ["VARIABLE"], "postprocess":  ([variable],l,rej) => {
           const r = isNumber(variable.value) ? variable.value : rej;
           log('VARIABLE_NUM', r)
           return r
        }  },
    {"name": "VALUE_NUM", "symbols": ["P_NUM"], "postprocess": id},
    {"name": "VALUE_NUM", "symbols": ["N"], "postprocess": id},
    {"name": "VALUE_NUM", "symbols": ["VARIABLE_NUM"], "postprocess": id},
    {"name": "VALUE_NUM", "symbols": ["FUNC_NUM"], "postprocess": id},
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
    {"name": "VALUE_UNIT", "symbols": ["VARIABLE_UNIT"], "postprocess": id},
    {"name": "VALUE_UNIT", "symbols": ["FUNC_UNIT"], "postprocess": id},
    {"name": "P_NUM", "symbols": [{"literal":"("}, "_", "OPS_NUM", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "P_UNIT", "symbols": [{"literal":"("}, "_", "OPS_UNIT", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "FUNC_UNIT", "symbols": ["FUNC"], "postprocess": ([v],l, rej) => isUnit(v) ? v : rej},
    {"name": "FUNC_NUM", "symbols": ["FUNC"], "postprocess": ([v],l, rej) => (isNumber(v) || v === null) ? v : rej},
    {"name": "FUNC$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$1", "P_NUM"], "postprocess": function(d) {return Math.sin(d[1]); }},
    {"name": "FUNC$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$2", "P_NUM"], "postprocess": function(d) {return Math.cos(d[1]); }},
    {"name": "FUNC$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$3", "P_NUM"], "postprocess": function(d) {return Math.tan(d[1]); }},
    {"name": "FUNC$string$4", "symbols": [{"literal":"t"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$4", "P_NUM"], "postprocess": function(d) {return Math.tan(d[1]); }},
    {"name": "FUNC$string$5", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$5", "P_NUM"], "postprocess": function(d) {return Math.cot(d[1]); }},
    {"name": "FUNC$string$6", "symbols": [{"literal":"c"}, {"literal":"t"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$6", "P_NUM"], "postprocess": function(d) {return Math.cot(d[1]); }},
    {"name": "FUNC$string$7", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$7", "P_NUM"], "postprocess": function(d) {return Math.asin(d[1]); }},
    {"name": "FUNC$string$8", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$8", "P_NUM"], "postprocess": function(d) {return Math.acos(d[1]); }},
    {"name": "FUNC$string$9", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$9", "P_NUM"], "postprocess": function(d) {return Math.atan(d[1]); }},
    {"name": "FUNC$string$10", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$10", "P_NUM"], "postprocess": function(d) {return Math.atan(d[1]); }},
    {"name": "FUNC$string$11", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$11", "P_NUM"], "postprocess": function(d) {return Math.sqrt(d[1]); }},
    {"name": "FUNC$string$12", "symbols": [{"literal":"l"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$12", "P_NUM"], "postprocess": function(d) {return Math.log(d[1]); }},
    {"name": "FUNC$string$13", "symbols": [{"literal":"l"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FUNC", "symbols": ["FUNC$string$13", "P_NUM"], "postprocess": function(d) {return Math.log10(d[1]); }},
    {"name": "FUNC", "symbols": ["sum"], "postprocess":  (d, l, rej) => {
          return getContext().sum()
          //const r = getContext().sum();
          //if (r === null) return rej
          //return r
        } },
    {"name": "FUNC", "symbols": ["average"], "postprocess":  (d, l, rej) => {
          return getContext().average()
          //const r = getContext().average()
          //if (r === null) return rej
          //return r
        } },
    {"name": "CONST$string$1", "symbols": [{"literal":"P"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CONST", "symbols": ["CONST$string$1"], "postprocess": function(d) {return Math.PI; }},
    {"name": "CONST", "symbols": [{"literal":"E"}], "postprocess": function(d) {return Math.E; }},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N", "symbols": [{"literal":"<"}, "CONST", {"literal":">"}], "postprocess": ([,c,]) => c},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {log('int', d); return parseInt(d[0], 10)}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {/*log('int:', d[0].join(""));*/ return d[0].join(""); }},
    {"name": "identifier$ebnf$1", "symbols": []},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": [/[a-zA-Z_]/, "identifier$ebnf$1"], "postprocess": ([r1,r2]) => [...r1, ...r2].join("")},
    {"name": "unit$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "unit$ebnf$1", "symbols": ["unit$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unit", "symbols": ["unit$ebnf$1", "separator"], "postprocess": 
        function(d, l, reject) {
          //const val = (d[0].concat(d[1])).join('').toLocaleLowerCase()
          const val = d[0].join('')
          log('u:', d, val)
        
          //  dont check unit correctness (assume math.js will)
          //?? if (val === 'PERCENT') reject
        
          // ??
          //if (confusingUnits.includes(val)) {
          //   log(`Denying confusing "${val}" unit`)
          //   return reject
          // }
        
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
    {"name": "EOL$string$1", "symbols": [{"literal":"<"}, {"literal":"E"}, {"literal":"O"}, {"literal":"L"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EOL", "symbols": ["EOL$string$1"]},
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
    {"name": "sum$string$1", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sum", "symbols": ["sum$string$1"]},
    {"name": "sum$string$2", "symbols": [{"literal":"t"}, {"literal":"o"}, {"literal":"t"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sum", "symbols": ["sum$string$2"]},
    {"name": "average$string$1", "symbols": [{"literal":"a"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":"a"}, {"literal":"g"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "average", "symbols": ["average$string$1"]},
    {"name": "average$string$2", "symbols": [{"literal":"a"}, {"literal":"v"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "average", "symbols": ["average$string$2"]},
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
   window.grammar = grammar;
}
})();
