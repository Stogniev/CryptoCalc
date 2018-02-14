import { isUserVariable } from './userVariables'
import is from 'is'
import { isUnit } from './common'
import { replaceAll } from './util'

const resultHumanizers = {
  'PERCENT': '%'
}


const formatFloat = (f) => parseFloat(f.toFixed(2))

export function formatResult(result) {
  let r = result

  if (r instanceof Error) return ''

  if (isUserVariable(r)) r = r.value

  if (isUnit(r)) {
    r = result.clone()
    r = formatFloat(r.toNumber()) + ' ' + r.formatUnits()
  }

  if (is.number(r)) r = formatFloat(r)

  if (is.string(r)) r = replaceAll(r, resultHumanizers)

  return r
}

