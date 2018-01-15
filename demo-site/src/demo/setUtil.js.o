// basic es6 Set functions by http://www.2ality.com/2015/01/es6-set-operations.html


// visualization for debugging

// Set.prototype.i = function() {
//   return '[Set: ' + Array.from(this).toString() + ']'
// }


// simple set creator. Usage: set(1,2,3) or set([1,2,3])
export function set() {
  if (arguments.length === 1) {
    return new Set(arguments[0])
  } else {
    return new Set(Object.values(arguments))
  }
}

// Note: see also https://github.com/torbs/set-utils (simple but uses lodash)
// TODO: unlimited args
export function union(a, b) {
  return new Set([...a, ...b])
}

export function intersect(a, b) {
  let bSet = set(b)
  return new Set([...a].filter(x => bSet.has(x)))
}

export function isIntersected(a, b) {
  return !isEmpty(intersect(a, b))
}

export function isEmpty(s) {
  return s.size === 0
}

export function isSubset(superSet, subSet) {
  return isEmpty(difference(superSet, subSet))
}

// TODO: test & optimize
export function equal(a, b) {
  return (intersect(a, b).size === a.size) && (a.size === b.size)
}

export function difference(a, b) {
  let bSet = set(b)
  return new Set([...a].filter(x => !bSet.has(x)))
}



// convert set to dictionary with set items as keys (and _value_s)
export function setToDict(s, value) {
  return [...s].reduce( (p,c) => {p[c] = value; return p} , {})
}



// Invert key and values in dict using ex-keys set as new values
// {a: 1, b:2 , c:3, d:1} =>
//    { '1': Set { 'a', 'd' }, '2': Set { 'b' }, '3': Set { 'c' } }
export function invertDict(d) {
  return Object.entries(d).reduce(
    (p,c) => {
      if (c[1] in p)
        p[c[1]].add(c[0]);
      else p[c[1]] = new Set([c[0]]);
      return p
    },
    {}
  )
}
