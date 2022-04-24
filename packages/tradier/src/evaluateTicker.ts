import { getOptionChain } from './index'
import { uniq } from 'lodash'

const NodeCache = require('node-cache')
const cache = new NodeCache()

type EvaluateReason = 'Invalid' | 'Strike too wide'

type EvaluateResult = {
  valid: boolean,
  reason?: EvaluateReason,
}


export const evaluateTickerHelper = async (ticker, maxStrikeWidth, expiration): Promise<EvaluateResult> => {
  try {
    const optionChain = await getOptionChain(ticker, expiration)

    // Only check near the money
    const strikes = uniq(optionChain.filter(link => link.delta >= 0.15 && link.delta <= 0.5).map(link => link.strike))
    const lowestStrikeWidth = strikes.reduce((acc, strike, index) => index === 0 ? acc : Math.min(strike - strikes[index - 1], acc), 100)

    if (lowestStrikeWidth > maxStrikeWidth) {
      return {
        valid: false,
        reason: 'Strike too wide'
      }
    }

    return {
      valid: true
    }
  } catch (e) {
    return {
      valid: false,
      reason: 'Invalid'
    }
  }
}

export const evaluateTicker = async (ticker, maxStrikeWidth, expiration): Promise<EvaluateResult> => {
  const key = `${ticker}${maxStrikeWidth}${expiration}`

  let value = cache.get(key)
  if (!value) {
    value = await evaluateTickerHelper(ticker, maxStrikeWidth, expiration)
    cache.set(key, value, 604800) // Cache for 1 week
  }
  return value
}