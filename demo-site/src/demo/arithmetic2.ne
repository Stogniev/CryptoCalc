# `main` is the nonterminal that nearley tries to parse, so we define it first.
# The _'s are defined as whitespace below. This is a mini-idiom.

@{%
  const math = require("mathjs");

  function log() {
    if (process.env.DEBUG) {
      console.log('-',Object.values(arguments))
    }
  }

  const common = require('./common')

  function isUnit(x) {
    return x instanceof math.type.Unit
  }

  function isNumber(x) {
    return typeof(x) === 'number'
  }

  // magic sum: "number/unit ± unit" treat as "unit ± unit"
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
%}


main -> _ OPS _ {% function(d) { log('>',d, typeof d[1]); return d[1]; } %}

# Operations (all)
OPS -> OPS_NUM        {% id %}
     | OPS_UNIT       {% id %}

OPS_NUM -> SHIFT        {% id %}

OPS_UNIT -> CONVERSION   {% id %}

CONVERSION ->
     AS_UNIT convert _ unit    {% (d,l,rej) => {log('convert:', d[0], d[3]); return d[0].to(d[3])} %}
   | AS_UNIT    {% id %}

# bitwise shift
SHIFT -> SHIFT leftShift AS_NUM   {% (d,l, rej) => d[0] << d[2] %}
       | SHIFT rightShift AS_NUM  {% (d,l, rej) => d[0] >> d[2] %}
       | AS_NUM  {% id %}

# add/subtract
AS_NUM ->
      AS_NUM plus MD_NUM {% (d,l, rej) => math.add(d[0], d[2]) %}
    | AS_NUM minus MD_NUM {% (d,l, rej) => math.subtract(d[0], d[2]) %}
    | MD_NUM  {% id %}

AS_UNIT -> AS_UNIT_MAGIC_ONLY_UNITS       {% id %}

#  magic operations from (filter units only - no numbers
AS_UNIT_MAGIC_ONLY_UNITS ->
   AS_UNIT_MAGIC {% (d,l, rej) => { log('AS_UNIT_MAGIC_ONLY_UNITS:', d);
                                    return isUnit(d[0]) ? d[0] : rej}  %}

# magic sum: "unit ± number/unit" treated as "unit ± unit")
AS_UNIT_MAGIC ->
      AS_UNIT_MAGIC plus MD {% (d,l, rej) => magicSum(d[0], d[2], math.add, rej) %}
    | AS_UNIT_MAGIC minus MD {% (d,l, rej) => magicSum(d[0], d[2], math.subtract, rej) %}
    | MD       {% id %}

MD -> MD_NUM    {% id %}
    | MD_UNIT   {% id %}

MD_NUM ->
     MD_NUM mul E_NUM   {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   # implicit multiplication (NOTE: always require spaces around parentheses)
   | MD_NUM __ E_NUM    {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   | MD_NUM divide E_NUM  {% (d,l, rej) => math.divide(d[0], d[2]) %}
   | MD_NUM mod E_NUM  {% (d,l, rej) => math.mod(d[0], d[2]) %}
   | E_NUM     {% id %}


# Multiplication and division
MD_UNIT ->
     MD_UNIT mul SIGNED_NUM  {% (d,l, rej) => math.multiply(d[0], d[2]) %}
   | MD_NUM mul SIGNED_UNIT  {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   # implicit multiplication (NOTE: always require spaces around parentheses)
   | MD_UNIT __ VALUE_NUM   {% (d,l, rej) => math.multiply(d[0], d[2]) %}
   | MD_NUM __ VALUE_UNIT   {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   | MD_UNIT divide SIGNED_NUM  {% (d,l, rej) => math.divide(d[0], d[2]) %}
   | SIGNED_UNIT                 {% id %}

# Exponents
E_NUM ->
     SIGNED_NUM exp E_NUM    {% (d,l,rej) => Math.pow(d[0], d[2])  %}
   | SIGNED_NUM              {% id %}

# Parentheses or unary signed N
SIGNED_NUM ->
    __ "+" _ VALUE_NUM  {% function(d) { /*log('value_num+');*/ return d[3]; } %}
  | __ "-" _ VALUE_NUM  {% function(d) { /*log('value_num-');*/ return math.multiply(-1, d[3]) } %}
  | VALUE_NUM        {% function(d) {/*log('value_num:', d[0]);*/ return d[0]; } %}


SIGNED_UNIT ->
    __ "+" _ VALUE_UNIT  {% function(d) { log('u+'); return d[3]; } %}
  | __ "-" _ VALUE_UNIT  {% function(d) { log('u-'); return math.multiply(-1, d[3]) } %}
  | VALUE_UNIT        {% function(d) {log('value+unit:', d[0]); return d[0]; } %}


VALUE_NUM ->
    P_NUM         {% id %}
  | N             {% id %}


VALUE_UNIT ->
    P_UNIT        {% id %}
  | VALUE_UNIT __ VALUE_NUM _ unit   {%         // example: "1m 20 cm 30 mm"
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
       %}
  | VALUE_NUM _ unit    {%
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
       %}

# paretheses with something
P_NUM -> "(" _ OPS_NUM _ ")" {% function(d) {return d[2]; } %}

P_UNIT -> "(" _ OPS_UNIT _ ")" {% function(d) {return d[2]; } %}


FUNC -> "sin" P_NUM     {% function(d) {return Math.sin(d[1]); } %}
   | "cos" P_NUM     {% function(d) {return Math.cos(d[1]); } %}
   | "tan" P_NUM     {% function(d) {return Math.tan(d[1]); } %}
    
   | "asin" P_NUM    {% function(d) {return Math.asin(d[1]); } %}
   | "acos" P_NUM    {% function(d) {return Math.acos(d[1]); } %}
   | "atan" P_NUM    {% function(d) {return Math.atan(d[1]); } %}
   | "sqrt" P_NUM    {% function(d) {return Math.sqrt(d[1]); } %}
   | "ln" P_NUM       {% function(d) {return Math.log(d[1]); } %}

CONST -> "pi"          {% function(d) {return Math.PI; } %}
   | "e"           {% function(d) {return Math.E; } %}



# A number value or a function of a number NOTE: no space between
N -> float          {% id %}
   | FUNC           {% id %}
   | CONST          {% id %}
   | ident         {%
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
    %}

# I use `float` to basically mean a number with a decimal point in it
float -> int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
| int           {% function(d) {log('int', d); return parseInt(d[0], 10)} %}

int -> [0-9]:+      {% function(d) {/*log('int:', d[0].join(""));*/ return d[0].join(""); } %}

ident -> [a-zA-Z]:+    {% function(d) {return d[0].join(""); } %}

unit ->
  # ([a-zA-Z]:+ [a-zA-Z0-9]:*)         # problem: multiple results
  [a-zA-Z0-9]:+ separator                       # problem: number-started units
    {%
       function(d, l, reject) {
         //const val = (d[0].concat(d[1])).join('').toLocaleLowerCase()
         const val = d[0].join('')
         log('u:', d, val)

         //  don't check unit correctness (assume math.js will)

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
     %}

separator -> ";"    #  common.lexemSeparator

plus -> _ "+" _
     | _ "plus" _
     | _ "and" _
     | _ "with" _

minus -> _ "-" _
     | _ "minus" _
     | _ "subtract" _
     | _ "without" _

mul -> _ "*" _
     | _ "times" _
     | _ "multiplied by" _
     | _ "mul" _

divide -> _ "/" _
     | _ "divide" _
     | _ "divide by" _
     | _ "divided by" _

exp -> _ "^" _

mod -> _ "mod" _

leftShift -> _ "<<" _

rightShift -> _ ">>" _

convert -> __ "in" __
         | __ "into" __
         | __ "as" __
         | __ "to" __


# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% function(d) {return null; } %}

__ -> [\s]:+     {% function(d) {return null; } %}
