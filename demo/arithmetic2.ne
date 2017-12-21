# This is a nice little grammar to familiarize yourself
# with the nearley syntax.

# It parses valid calculator input, obeying OOO and stuff.
#   ln (3 + 2*(8/e - sin(pi/5)))
# is valid input.

# This is (hopefully) pretty self-evident.

# `main` is the nonterminal that nearley tries to parse, so
# we define it first.
# The _'s are defined as whitespace below. This is a mini-
# -idiom.

# NOTE: need prepare exprs
# NOTE: need put space before all math "(" and after all ")"

main -> _ OPS _ {% function(d) {return d[1]; } %}

# We define each level of precedence as a nonterminal.

# only paretheses
P -> "(" _ OPS _ ")" {% function(d) {return d[2]; } %}

# Parentheses or N
PN -> P             {% id %}
    | N             {% id %}

# Exponents
E -> PN exp E    {% function(d) {return Math.pow(d[0], d[2]); } %}
   | PN             {% id %}

# ?
# E2 -> E2 exp PN    {% function(d) {return Math.pow(d[0], d[2]); } %}
#     | PN


# Multiplication and division
MD -> MD mul E         {% function(d) {return d[0]*d[2]; } %}

     # implicit multiplication (NOTE: always require spaces around parentheses)
     | MD __ E           {% function(d) {return d[0] * d[2]; } %}

     | MD divide E         {% function(d) {return d[0]/d[2]; } %}
     | E                    {% id %}


AS -> AS plus MD {% function(d) {return d[0]+d[2]; } %}
    | AS minus MD {% function(d) {return d[0]-d[2]; } %}
    | MD            {% id %}

# bitwise shift
SHIFT -> SHIFT leftShift AS   {% function(d) {return d[0] << d[2]; } %}
       | SHIFT rightShift AS    {% function(d) {return d[0] >> d[2]; } %}
       | AS         {% id %}

# Operations (all)
OPS -> SHIFT              {% id %}


# A number or a function of a number NOTE: no space betweeb
N -> float          {% id %}
   | "sin" P     {% function(d) {return Math.sin(d[1]); } %}
   | "cos" P     {% function(d) {return Math.cos(d[1]); } %}
   | "tan" P     {% function(d) {return Math.tan(d[1]); } %}
    
   | "asin" P    {% function(d) {return Math.asin(d[1]); } %}
   | "acos" P    {% function(d) {return Math.acos(d[1]); } %}
   | "atan" P    {% function(d) {return Math.atan(d[1]); } %}
   | "sqrt" P    {% function(d) {return Math.sqrt(d[1]); } %}
   | "ln" P       {% function(d) {return Math.log(d[1]); } %}

   | "pi"          {% function(d) {return Math.PI; } %}
   | "e"           {% function(d) {return Math.E; } %}
   | ident         {% function(d, l, reject) {
                         if (['sin', 'cos', 'tan', 'pi', 'e', 'asin', 'acos', 'atan',
                             ].includes(d[0])) {  //NOTE: put all identifiers
                           return reject;
                         } else {
                           if (false) {  // TODO: check/put variable here if exists
                             return variables(d[0])
                           } else {
                             return reject
                           }
                         }
                       }
                    %}

# I use `float` to basically mean a number with a decimal point in it
float ->
      int "." int   {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
    | int           {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+      {% function(d) {return d[0].join(""); } %}

ident -> [a-z]:+    {% function(d) {return d[0].join(""); } %}




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

modulo -> __ "mod" __


# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*     {% function(d) {return null; } %}

__ -> [\s]:+     {% function(d) {return null; } %}
