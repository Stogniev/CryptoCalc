# `main` is the nonterminal that nearley tries to parse, so we define it first.
# The _'s are defined as whitespace below. This is a mini-idiom.

@{%
    /*const moo = require("moo");
  
  const lexer = moo.compile({
    ws:     /[ \t]+/,
    number: /[0-9]+/,
    word: /[a-z]+/,
    times:  /\*|x/
    }); */

  const math = require("mathjs");

  function log() {
    if (process.env.DEBUG) {
      console.log('-',Object.values(arguments))
    }
  }


  const { isUnit, isPercent, isMeasure, isNumber, toUnit } = require('./common')
  //const { confusingUnits } = require('./unitUtil')

  const { setUserVariable, userVariables, validateVariableName, isUserVariable } = require('./userVariables')
%}

#  @lexer lexer

main -> line {%  ([line],l,rej) => {
    // setting prev variable as parsing side-effect (is not very good but simple)
    let prev = isUserVariable(line) ? line.value : line
    log('prev:', prev)
    setUserVariable('prev', prev)

    return line
  }
%}

line ->
   identifier _ "=" EXPRESSION EOL {%
        ([name,,,expression,],l,rej) => {
          try {
            validateVariableName(name)
          } catch(e) {
            return rej
          }

          let v = setUserVariable(name, expression)
          return v
        }
     %}
 | EXPRESSION EOL     {%  ([expr], l, rej) => { return expr } %}


EXPRESSION -> _ OPS _     {% function([,ops,]) {
                               log('>', ops);
                               //setUserVariable('prev', ops)
                               return ops
                             }   %}

# Operations (all)
OPS -> OPS_NUM        {% id %}
     | OPS_UNIT       {% id %}

OPS_NUM -> SHIFT         {% id %}
OPS_UNIT -> CONVERSION   {% id %}

CONVERSION ->
     AS_UNIT convert _ unit    {% (d,l,rej) => {log('convert:', d[0], d[3]); return d[0].to(d[3])} %}
   | AS_UNIT    {% id %}

# bitwise shift
SHIFT -> SHIFT leftShift AS_NUM   {% (d,l, rej) => d[0] << d[2] %}
       | SHIFT rightShift AS_NUM  {% (d,l, rej) => d[0] >> d[2] %}
       | AS_NUM  {% id %}

# MD_ - multiple/division
# AS_ - add/subtract
#
# MEASURE - measure (kg, cm...) and money ($, UAH, ...) units
# PERCENT - percent units
# UNIT - any unit ($, cm, %)
# NUMBER - number (integer, float)


AS_UNIT ->
   AS_MEASURE       {% id %}
 | AS_PERCENT       {% id %}


AS_MEASURE ->
   AS_NUM plus AS_MEASURE      {% (d,l,rej) => math.add(toUnit(d[0], d[2]), d[2]) %}
 | AS_MEASURE plus MD_NUM      {% (d,l,rej) => math.add(d[0], toUnit(d[2], d[0])) %}
 | AS_NUM minus AS_MEASURE     {% (d,l,rej) => math.subtract(toUnit(d[0], d[2]), d[2]) %}
 | AS_MEASURE minus MD_NUM     {% (d,l,rej) => math.subtract(d[0], toUnit(d[2], d[0])) %}

 | AS_MEASURE plus MD_MEASURE  {% (d,l,rej) => math.add(d[0], d[2]) %}
 | AS_MEASURE minus MD_MEASURE {% (d,l,rej) => math.subtract(d[0], d[2]) %}

 | AS_MEASURE plus MD_PERCENT  {% ([u,,p], l, rej) => {
      log('m-%', u,p)
      u.value = u.value + u.value/100*p.toNumber()
      return u
   } %}
 | AS_MEASURE minus MD_PERCENT {% ([u,,p], l, rej) => {
      log('m-%', u,p)
      u.value = u.value - u.value/100*p.toNumber()
      return u
   } %}
 | MD_MEASURE                   {% id %}


AS_PERCENT ->
   AS_PERCENT plus MD_PERCENT   {% (d,l,rej) => math.add(d[0], d[2]) %}
 | AS_PERCENT minus MD_PERCENT  {% (d,l,rej) => math.subtract(d[0], d[2]) %}
 | AS_PERCENT plus AS_NUM       {% ([p,,n],l,rej) => math.add(p, toUnit(n, p)) %}
 | AS_PERCENT minus AS_NUM      {% ([p,,n],l,rej) => math.subtract(p, toUnit(n, p)) %}
 | MD_PERCENT                   {% id %}



AS_NUM ->
   AS_NUM plus MD_NUM   {% ([a,,b], l,rej) => math.add(a, b) %}
 | AS_NUM minus MD_NUM  {% ([a,,b],l,rej) => math.subtract(a, b) %}
 | AS_NUM plus MD_PERCENT {% ([n,,p],l,rej) => math.add(n, n/100*p.toNumber()) %}
 | AS_NUM minus MD_PERCENT {% ([n,,p],l,rej) => math.subtract(n, n/100*p.toNumber()) %}
 | MD_NUM  {% id %}


MD_MEASURE ->
     MD_MEASURE mul SIGNED_NUM  {% (d,l, rej) => math.multiply(d[0], d[2]) %}
   | MD_NUM mul SIGNED_MEASURE  {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   | MD_MEASURE mul VALUE_PERCENT  {% ([m,,p],l, rej) =>{log('m*p', m,p); return math.multiply(m, p.value/100) } %}
   | VALUE_PERCENT __ "of" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('p of m', p, m); return math.multiply(m, p.value/100) } %}
   | VALUE_PERCENT __ "ofwhatis" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('% of what is m', p, m); return math.multiply(m, p.value/100) } %}
   | VALUE_PERCENT __ "on" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('p on m', p, m); return math.add(m, math.multiply(math.divide(m, 100), p.value)) } %}
   | VALUE_PERCENT __ "onwhatis" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('p onwhatis m', p, m); return math.add(m, math.multiply(math.divide(m, 100), p.value)) } %}
   | VALUE_PERCENT __ "off" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('p off m', p, m); return math.subtract(m, math.multiply(math.divide(m, 100), p.value)) } %}
   | VALUE_PERCENT __ "offwhatis" __ MD_MEASURE  {% ([p,,,,m],l, rej) =>{log('p offwhatis m', p, m); return math.subtract(m, math.multiply(math.divide(m, 100), p.value)) } %}

   | MD_MEASURE divide VALUE_PERCENT  {% ([m,,p],l, rej) => {log('m/p', m,p,p.value); return math.divide(m, p.value/100) } %}

   # implicit multiplication (NOTE: always require spaces around parentheses)
   | MD_MEASURE __ VALUE_NUM   {% (d,l, rej) => math.multiply(d[0], d[2]) %}
   | MD_NUM __ VALUE_MEASURE   {% (d,l, rej) => math.multiply(d[0], d[2]) %}

   | MD_MEASURE divide SIGNED_NUM  {% (d,l, rej) => math.divide(d[0], d[2]) %}
   | SIGNED_MEASURE                 {% id %}

MD_PERCENT ->
    MD_PERCENT mul VALUE_NUM  {% ([p,,n],l, rej) => {log(`%*n`,p,n); return math.multiply(p, n)} %}
  | MD_PERCENT __ VALUE_NUM   {% ([p,,n],l, rej) =>  math.multiply(p, n) %}
  | MD_PERCENT divide VALUE_NUM  {% ([p,,n],l, rej) => {log(`%/n`,p,n); return math.divide(p, n)} %}
  | MD_NUM __ "asapercentof" __ MD_NUM  {% ([n1,,,,n2],l, rej) => {log('n1 as a % of n2', n1, n2); return math.unit(math.divide(n1, math.divide(n2, 100)), 'PERCENT') } %}
  | MD_NUM __ "asapercenton" __ MD_NUM  {% ([n1,,,,n2],l, rej) => {log('n1 as a % on n2', n1, n2); return math.unit(math.divide(math.subtract(n1, n2), math.divide(n2, 100)), 'PERCENT')} %}
  | MD_NUM __ "asapercentoff" __ MD_NUM  {% ([n1,,,,n2],l, rej) => {log('n1 as a % off n2', n1, n2); return math.unit(math.divide(n1, math.divide(n2, 100)), 'PERCENT')} %}

  | MD_MEASURE __ "asapercentof" __ MD_MEASURE  {% ([m1,,,,m2],l, rej) => {log('m1 as a % of m2', m1, m2); return math.unit(math.divide(m1, math.divide(m2, 100)), 'PERCENT') } %}
  | MD_MEASURE __ "asapercenton" __ MD_MEASURE  {% ([m1,,,,m2],l, rej) => {log('m1 as a % on m2', m1, m2); return math.unit(math.divide(math.subtract(m1, m2), math.divide(m2, 100)), 'PERCENT')} %}
  | MD_MEASURE __ "asapercentoff" __ MD_MEASURE  {% ([m1,,,,m2],l, rej) => {log('m1 as a % off m2', m1, m2); return math.unit(math.divide(m1, math.divide(m2, 100)), 'PERCENT')} %}
  | SIGNED_PERCENT       {% id %}

MD_NUM ->
     MD_NUM mul E_NUM   {% (d,l, rej) => math.multiply(d[0], d[2]) %}
   | MD_NUM mul SIGNED_PERCENT  {% ([n,,p],l,rej) => n * p.value/100 %}

   # implicit multiplication (NOTE: always require spaces around parentheses)
   | MD_NUM __ E_NUM    {% (d,l, rej) => math.multiply(d[0], d[2]) %}
#   | MD_NUM __ SIGNED_PERCENT  {% ([n,,p],l,rej) => n * p.value/100 %}

   | MD_NUM divide E_NUM  {% (d,l, rej) => math.divide(d[0], d[2]) %}
   | MD_NUM divide SIGNED_PERCENT  {% ([n,,p],l,rej) => n / p.value*100 %}
   | MD_NUM mod E_NUM  {% (d,l, rej) => math.mod(d[0], d[2]) %}
   | E_NUM     {% id %}


SIGNED_PERCENT -> SIGNED_UNIT   {% (d,l, rej) => isPercent(d[0]) ? d[0] : rej %}
SIGNED_MEASURE -> SIGNED_UNIT   {% (d,l, rej) => isMeasure(d[0]) ? d[0] : rej %}

VALUE_MEASURE -> VALUE_UNIT     {% (d,l, rej) => isMeasure(d[0]) ? d[0] : rej %}
VALUE_PERCENT -> VALUE_UNIT     {% (d,l, rej) => isPercent(d[0]) ? d[0] : rej %}



# Exponents
E_NUM ->
     SIGNED_NUM exp E_NUM    {% (d,l,rej) => Math.pow(d[0], d[2])  %}
   | SIGNED_NUM              {% id %}

# Parentheses or unary signed number
SIGNED_NUM ->
    __ "+" _ VALUE_NUM  {% function(d) { /*log('value_num+');*/ return d[3]; } %}
  | __ "-" _ VALUE_NUM  {% function(d) { /*log('value_num-');*/ return math.multiply(-1, d[3]) } %}
  | VALUE_NUM        {% function(d) {/*log('value_num:', d[0]);*/ return d[0]; } %}


SIGNED_UNIT ->
    __ "+" _ VALUE_UNIT  {% function(d) { log('u+'); return d[3]; } %}
  | __ "-" _ VALUE_UNIT  {% function(d) { log('u-'); return math.multiply(-1, d[3]) } %}
  | VALUE_UNIT        {% function(d) {log('value+unit:', d[0]); return d[0]; } %}


VARIABLE ->
   identifier   {% ([name],l,rej) => {
                      const r = userVariables.find( x => (x.name === name) ) || rej
                      //log('VARIABLE', name, userVariables, r)
                      return r
                    }    %}

VARIABLE_UNIT ->
   VARIABLE    {% ([variable],l,rej) => isUnit(variable.value) ? variable.value : rej  %}

VARIABLE_NUM ->
   VARIABLE    {% ([variable],l,rej) => {
                      const r = isNumber(variable.value) ? variable.value : rej;
                      log('VARIABLE_NUM', r)
                      return r
                   }  %}

VALUE_NUM ->
    P_NUM         {% id %}
  | N             {% id %}
  | VARIABLE_NUM  {% id %}


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
  | VARIABLE_UNIT      {% id %}


# paretheses with something
P_NUM -> "(" _ OPS_NUM _ ")" {% function(d) {return d[2]; } %}

P_UNIT -> "(" _ OPS_UNIT _ ")" {% function(d) {return d[2]; } %}


FUNC -> "sin" P_NUM  {% function(d) {return Math.sin(d[1]); } %}
   | "cos" P_NUM     {% function(d) {return Math.cos(d[1]); } %}
   | "tan" P_NUM     {% function(d) {return Math.tan(d[1]); } %}
   | "tg" P_NUM      {% function(d) {return Math.tan(d[1]); } %}
   | "cot" P_NUM     {% function(d) {return Math.cot(d[1]); } %}
   | "ctg" P_NUM     {% function(d) {return Math.cot(d[1]); } %}
   | "asin" P_NUM    {% function(d) {return Math.asin(d[1]); } %}
   | "acos" P_NUM    {% function(d) {return Math.acos(d[1]); } %}
   | "atan" P_NUM    {% function(d) {return Math.atan(d[1]); } %}
   | "atg" P_NUM     {% function(d) {return Math.atan(d[1]); } %}
   | "sqrt" P_NUM    {% function(d) {return Math.sqrt(d[1]); } %}
   | "ln" P_NUM      {% function(d) {return Math.log(d[1]); } %}
   | "lg" P_NUM      {% function(d) {return Math.log10(d[1]); } %}

CONST -> "pi"          {% function(d) {return Math.PI; } %}
   | "e"           {% function(d) {return Math.E; } %}


# A number value or a function of a number NOTE: no space between
N -> float          {% id %}
   | FUNC           {% id %}
   | CONST          {% id %}

# I use `float` to basically mean a number with a decimal point in it
float -> int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
 | int           {% function(d) {log('int', d); return parseInt(d[0], 10)} %}

int -> [0-9]:+      {% function(d) {/*log('int:', d[0].join(""));*/ return d[0].join(""); } %}

identifier -> [a-zA-Z_] [a-zA-Z0-9_]:*    {% ([r1,r2]) => [...r1, ...r2].join("")  %}

unit ->
  # ([a-zA-Z]:+ [a-zA-Z0-9]:*)         # problem: multiple results (8: maybe remove +)
  [a-zA-Z0-9]:+ separator                       # problem: number-started units
    {%
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
     %}

separator -> ";"    #  lexemSeparator

EOL -> "<EOL>"

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
