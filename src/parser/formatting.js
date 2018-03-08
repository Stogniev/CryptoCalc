import is from 'is'
import { isUserVariable } from './userVariables'
import { isUnit, lexemSeparator } from '../common'

const formatFloat = (f) => parseFloat(f.toFixed(2))


// used to humanize back parsed expression
const expressionHumanizers = {
  ofwhatis: 'of what is',
  onwhatis: 'on what is',
  offwhatis: 'off what is',
  asapercentof: 'as a % of',
  asapercenton: 'as a % on',
  asapercentoff: 'as a % off',

  plus: '+',
  and: '+',
  with: '+',

  minus: '-',
  subtract: '-',
  without: '-',

  times: '*',
  'multiplied by': '*',
  mul: '*',

  divide: '/',
  'divide by': '/',

  [lexemSeparator]: '',

  PERCENT: '%',
  '<EOL>': '',

  // cons
  '<Pi>': 'Pi',
  '<E>': 'E',
  

  // wrap all signs with space (NOTE: this is after all replacings like "plus -> +" )
  '([-+*/])': ' $1 ',

  // remove multispaces
  '\\s+': ' ',

  // remove spaces before "%" (better look)
  '\\s+%': '%',
}

export function humanizeExpression(text) {
  let r = text

  // TODO: refactor (https://stackoverflow.com/a/15604206/1948511)
  Object.entries(expressionHumanizers).forEach(
    ([from, to]) => r = r.replace(new RegExp(from, 'g'), to)
  )

  return r
}

export function formatResult(result) {
  let r = result

  if (r instanceof Error) return ''

  if (isUserVariable(r)) r = r.value

  if (isUnit(r)) {
    r = result.clone()
    r = formatFloat(r.toNumber()) + ' ' + r.formatUnits()
  }

  if (is.number(r)) r = formatFloat(r)

  if (is.string(r)) r = humanizeExpression(r)

  return r
}
