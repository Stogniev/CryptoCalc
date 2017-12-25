# `main` is the nonterminal that nearley tries to parse, so we define it first.
# The _'s are defined as whitespace below. This is a mini-idiom.

@{%
  const math = require("mathjs");
  // TODO: add all
  const StandartFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'ln']

  // TODO: add all
  const Units = ['cm', 'm', 'km', 'usd', 'uah', 'kg', 'g']

  function l() {
    //console.log('-',Object.values(arguments))
  }
%}


# Required preparations
# 0) remove multispaces
# 1) put spaces around all math braces
# 2) remove spaces between standard function calls braces likd "sin(...)"
# 3) Add spaces before all +/- signs (to simplify unary/binary sign logic)
# 4) wrap by space all units (USD, Gb, km...) NOTE: cannot lowercase (mm & Mm)

main -> _ OPS _ {% function(d) { return d[1]; } %}

# Operations (all)
OPS -> SHIFT              {% id %}

# bitwise shift
SHIFT -> SHIFT leftShift AS   {% function(d) {return d[0] << d[2]; } %}
       | SHIFT rightShift AS    {% function(d) {return d[0] >> d[2]; } %}
       | AS         {% id %}

AS -> AS plus MD {% function(d,l, reject) {
        //console.log(22,  d[0], d[2])

        // reject "3 cm + 2"
        if (d[0].constructor.name !== d[2].constructor.name) {  // ok?
          //console.log('incompatible sum:', d[0], d[2])
          return reject
        }
        //console.log('plus:', d[0], d[2])
        return math.add(d[0], d[2]);
      } %}
    | AS minus MD {% function(d) {return d[0]-d[2]; } %}
    | MD            {% id %}

# Multiplication and division
MD -> MD mul E         {% function(d) {/*l('mul');*/ return d[0]*d[2]; } %}

     # implicit multiplication (NOTE: always require spaces around parentheses)
     | MD __ E           {% function(d) {l('imul'); return d[0] * d[2]; } %}

     | MD divide E         {% function(d) {return d[0]/d[2]; } %}
     | E                    {% id %}

# Exponents
E -> SIGNED exp E    {% function(d) {return Math.pow(d[0], d[2]); } %}
   | SIGNED          {% id %}

# Parentheses or unary signed N
SIGNED ->  VALUE_WITH_UNIT        {% function(d) {l('vwu', d[0]); return d[0]; } %}
  | __ "+" _ VALUE_WITH_UNIT  {% function(d) { l('u+'); return d[3]; } %}
  | __ "-" _ VALUE_WITH_UNIT  {% function(d) { l('u-'); return math.multiply(-1, d[3]) } %}

VALUE_WITH_UNIT ->
     VALUE __ unit    {%
         function(d,l, reject) {
     
           try {
             //console.log('value with unit:', math.unit(d[0], d[2]));
             return math.unit(d[0], d[2])
           } catch(e) {
             console.warn('no unit:', e.message)
             return reject
           }
         }
       %}
    |
    VALUE      {% function(d) {l('just value:', d[0]); return d[0]; } %}

# Parentheses or N
VALUE -> P            {% id %}
       | N             {% id %}

# paretheses only
P -> "(" _ OPS _ ")" {% function(d) {return d[2]; } %}

FUNC -> "sin" P     {% function(d) {return Math.sin(d[1]); } %}
   | "cos" P     {% function(d) {return Math.cos(d[1]); } %}
   | "tan" P     {% function(d) {return Math.tan(d[1]); } %}
    
   | "asin" P    {% function(d) {return Math.asin(d[1]); } %}
   | "acos" P    {% function(d) {return Math.acos(d[1]); } %}
   | "atan" P    {% function(d) {return Math.atan(d[1]); } %}
   | "sqrt" P    {% function(d) {return Math.sqrt(d[1]); } %}
   | "ln" P       {% function(d) {return Math.log(d[1]); } %}

CONST -> "pi"          {% function(d) {return Math.PI; } %}
   | "e"           {% function(d) {return Math.E; } %}



# A number value or a function of a number NOTE: no space between
N -> float          {% id %}
   | FUNC           {% id %}
   | CONST          {% id %}
   # | ident         {%
   #    function(d, l, reject) {
   #      if (['sin', 'cos', 'tan', 'pi', 'e', 'asin', 'acos', 'atan', 'ln', 'sqrt'
   #          ].includes(d[0])) {  //NOTE: put all identifiers
   #          console.log('reject ident1');
   #          return reject;
   #      } else {
   #        if (false) {  // TODO: check/put variable here if exists
   #          return variables(d[0])
   #        } else {
   #          console.log('reject ident2')
   #          return reject;
   #        }
   #      }
   #    }
   #  %}

# I use `float` to basically mean a number with a decimal point in it
float -> int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
       | int           {% function(d) {/*l('int', d);*/ return parseInt(d[0])} %}

int -> [0-9]:+      {% function(d) {/*l('int:', d[0].join(""));*/ return d[0].join(""); } %}

ident -> [a-zA-Z]:+    {% function(d) {return d[0].join(""); } %}

unit ->
  # ([a-zA-Z]:+ [a-zA-Z0-9]:*)         # problem: multiple results
  [a-zA-Z0-9]:+                        # problem: number-started units
    {%
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
     %}

plus -> _ "+" _
     | __ "plus" __
     | __ "and" __
     | __ "with" __

minus -> _ "-" _
     | __ "minus" __
     | __ "subtract" __
     | __ "without" __

mul -> _ "*" _
     | __ "times" __
     | __ "multiplied by" __
     | __ "mul" __

divide -> _ "/" _
     | __ "divide" __
     | __ "divide by" __

exp -> _ "^" _

leftShift -> _ "<<" _

rightShift -> _ ">>" _

modulo -> __ "mod" __      # TODO



# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% function(d) {return null; } %}

__ -> [\s]:+     {% function(d) {return null; } %}
