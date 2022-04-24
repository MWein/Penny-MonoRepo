import { Position } from "@penny/tradier"
import { getUnderlying, getType, getStrike, isOption, getExpiration } from "@penny/option-symbol-parser" 
import { uniq } from 'lodash'

export type SpreadSide = 'long' | 'short' | 'indeterminate'

export type SpreadOutcome = {
  ticker: string,
  side: SpreadSide,
  maxLoss: number,
  maxGain: number,
  fullyCovered: boolean,
  positions: Position[]
}


type PositionResult = {
  invoked: boolean,
  value: number,
}


const determineSide = (costBasis: number): SpreadSide => {
  if (costBasis < 0) {
    return 'short'
  } else if (costBasis > 0) {
    return 'long'
  }
  return 'indeterminate'
}


const determinePositionResultForStrike = (position: Position, strike: number): PositionResult => {
  const posType = getType(position.symbol)
  const posStrike = getStrike(position.symbol)

  if (posType === 'call') {
    if (strike >= posStrike) {
      const purchaseValue = posStrike * -100
      return {
        invoked: true,
        value: purchaseValue * position.quantity
      }
    }
    return {
      invoked: false,
      value: 0,
    }
  }
  
  // Put
  if (strike <= posStrike) {
    const saleValue = posStrike * 100
    return {
      invoked: true,
      value: saleValue * position.quantity
    }
  }
  return {
    invoked: false,
    value: 0,
  }
}


// Assumes that all of them expire on the same day
export const getSpreadOutcome = (underlying: string, positions: Position[]): SpreadOutcome => {
  const onlyUnderlying = positions.filter(pos => getUnderlying(pos.symbol) === underlying && isOption(pos.symbol))
  const costBasis = positions.reduce((acc, pos) => acc + pos.cost_basis, 0)
  const fullyCovered = onlyUnderlying.reduce((acc, pos) => acc + pos.quantity, 0) === 0

  const strikes = onlyUnderlying.map(pos => getStrike(pos.symbol)).sort((a, b) => a - b)

  strikes.push(strikes[strikes.length - 1] + 1) // Add last strike plus 1
  strikes.unshift(strikes[0] - 1) // Add first strike minus 1
  
  const resultAtEachStrike = strikes.map(strike =>
    onlyUnderlying.reduce((acc, pos) => {
      const { invoked, value } = determinePositionResultForStrike(pos, strike)
      return {
        numInvoked: acc.numInvoked + (invoked ? 1 : 0),
        total: acc.total + value
      }
    }, {
      numInvoked: 0,
      total: 0,
    })
  )
  // If fully covered, do not return results where protective side not invoked
  .filter(result => result.numInvoked % 2 === 0)
  .map(result => result.total - costBasis)

  // For iron condors, there would be no strike between the spreads with the above, adding it manually
  // A lot less complex
  // Also theres a weird edge case where -0 is returned, using a ternary to just return 0
  resultAtEachStrike.push(costBasis === 0 ? 0 : costBasis * -1)

  let maxLoss = Math.min(...resultAtEachStrike)
  let maxGain = Math.max(...resultAtEachStrike)

  // Edge case for straddles and strangles
  // Only one unique value is returned since resultAtEachStrike only contains values where number of legs invoked is even
  const uniqResults = uniq(resultAtEachStrike)
  if (uniqResults.length === 1) {
    const result = uniqResults[0]
    if (result < 0) {
      maxGain = Infinity
    }
    if (result > 0) {
      maxLoss = -Infinity
    }
  }

  return {
    ticker: underlying,
    side: determineSide(costBasis),
    maxLoss,
    maxGain,
    fullyCovered,
    positions,
  }
}



export const getSpreadOutcomes = (positions: Position[]): SpreadOutcome[] =>
  uniq(positions.map(pos => getUnderlying(pos.symbol))).reduce((acc, underlying) => {
    const positionsWithUnderlying = positions.filter(pos => getUnderlying(pos.symbol) === underlying)
    const expirations = uniq(positionsWithUnderlying.map(pos => getExpiration(pos.symbol)))

    const spreadResults = expirations.map(exp =>
      getSpreadOutcome(underlying, positionsWithUnderlying.filter(pos => getExpiration(pos.symbol) === exp))
    )

    return [
      ...acc,
      ...spreadResults,
    ]
  }, [])