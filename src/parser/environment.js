const { isUserVariable, createUserVariable } = require('./userVariables')
const { isUnit, log } = require('../common')
const { setContext } = require('./parserContext')
const { prepareTxt, createParser } = require('./parser')

const DEBUG = process.env.DEBUG

const calcEnvironmentProto = {
  prev: null,
  expressions: [],
  results: [],
  userVariables: {},

  sum() {
    if (!this.results.length) return null

    // use parser to sum items of different types
    let sum

    for (const [i, r] of this.results.entries()) {
      if (this.expressions[i] === '<EOL>') return null;

      if (r instanceof Error) return null

      if (i === 0) {
        sum = isUnit(r) ? r.clone() : r      // init
      } else {
        const expression = `${sum} + (${r}) ` // brase second arg to sum negatives
        const s = this.prepareAndCallInternal(expression, DEBUG)
        if (s instanceof Error) {
          log(`Summarize error of "${expression}"):`, s)
          return null
        }
        sum = s
      }
    }

    //log('r', sum)
    return sum
  },

  average() {
    //if (!this.results.length) return null
    const sum = this.sum()
    if (!sum) return null
    return this.prepareAndCallInternal(`${this.sum()} / ${this.results.length}`)
  },

  reset() {
    this.prev = null
    this.expressions = []
    this.results = []
    this.userVariables = {}
  },

  prepareAndCallInternal(text, verbose=DEBUG) {
    const prepared = prepareTxt(text, verbose)
    return this.callInternal(prepared, verbose)
  },

  callInternal(txt, verbose=DEBUG) {

    const parser = createParser()
    //let info = parser.save()
    try {
      //const parser = createParser()
      parser.feed(txt);

      if (parser.results.length > 1) {
        console.warn(`Multiple result for "${txt}": ${parser.results}`)
        throw new Error('multiresults')
      }

      if (parser.results.length === 0) {
        throw new Error(`Empty result for "${txt}"`)
      }

      if (verbose) {
        log(txt, '-c->', parser.results)
      }
      //return parser
    } catch(e) {
      //parser.restore(info)
      if (verbose) {
        log(`"${txt}" -E-> `, e)
      }
      //exp: 115  throw e
      return e
    }

    return parser.results[0]
  },

  // parserSave() {
  //   return this.parser.save()
  //   //this.parserSavePlace = this.parser.save()
  //   //return this.parserInfo
  // },
  //
  // parserRestore(info) {
  //   this.parser.restore(info)  //this.parserSavePlace
  // },

  call(text, verbose=DEBUG) {
    setContext(this)  // set parser context
    //let result;
    // try {


    const prepared = prepareTxt(text, verbose)
    this.expressions.push(prepared)
    const result = this.callInternal(prepared, verbose)

    // } catch(e) {
    //   console.warn('Error:', e)
    //   this.prev = `Error: ${e}`
    //   this.results.push(`Error: ${e}`)
    //   throw e
    // }

    //console.log('R:', result)

    if (isUserVariable(result)) {
      // 113 temporarily set variable to variable INSTANCE (not value)
      this.userVariables[result.name] = result/*.value*/ //112 setUserVariable(result)

      this.prev = createUserVariable('prev', result.value)
      this.results.push(result.value)
    } else {
      this.prev = createUserVariable('prev', result)
      this.results.push(result)
    }
    //116this.prev = createUserVariable('prev', result)

    //console.log('Context:', {prev: this.prev, results: this.results, variables: this.userVariables})
    return result
  }
}

export function createCalcEnvironment() {
  const r = Object.create(
    calcEnvironmentProto,
    // {prev: { value: 'Carl', writable: true, enumerable: true }},
    // {results: { /*value: 'Carl',*/ writable: true, enumerable: true }},
  )
  r.reset()  // clone proto object properties (to avoid prototype's modifications)
  return r
}


//module.exports = { prepareAndParse, prepareTxt, createParser, createCalcEnvironment }
