import { Position } from "@penny/tradier"
import { getUnderlying, getType, getStrike } from "@penny/option-symbol-parser" 


type SpreadSide = 'long' | 'short' | 'indeterminate'

export type SpreadOutcome = {
  ticker: string,
  side: SpreadSide,
  maxLoss: number,
  maxGain: number,
  fullyCovered: boolean,
}


const determineSide = (costBasis: number): SpreadSide => {
  if (costBasis < 0) {
    return 'short'
  } else if (costBasis > 0) {
    return 'long'
  }
  return 'indeterminate'
}


// Assumes that all of them expire on the same day
export const getSpreadOutcome = (underlying: string, positions: Position[]): SpreadOutcome => {
  const onlyUnderlying = positions.filter(pos => getUnderlying(pos.symbol) === underlying)
  const costBasis = positions.reduce((acc, pos) => acc + pos.cost_basis, 0)

  const strikes = onlyUnderlying.map(pos => getStrike(pos.symbol)).sort((a, b) => a - b)

  console.log(strikes)

  return {
    ticker: underlying,
    side: determineSide(costBasis),
    maxLoss: 0,
    maxGain: 0,
    fullyCovered: onlyUnderlying.reduce((acc, pos) => acc + pos.quantity, 0) === 0,
  }
}