import { Position } from "@penny/tradier"
import { getUnderlying, getType, getStrike, isOption } from "@penny/option-symbol-parser" 


type SpreadSide = 'long' | 'short' | 'indeterminate'

export type SpreadOutcome = {
  ticker: string,
  side: SpreadSide,
  maxLoss: number,
  maxGain: number,
  fullyCovered: boolean,
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

  // const invoked = posType === 'call' ? strike >= posStrike : strike <= posStrike
  // const value = (posType === 'call' ? posStrike * -100 : posStrike * 100) * position.quantity
  // const returnValue = invoked ? value : 0

  // return {
  //   invoked,
  //   value: returnValue,
  // }

  // TODO Refactor
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
  ).filter(result => result.numInvoked % 2 === 0).map(result => result.total - costBasis)

  // For iron condors, there would be no strike between the spreads with the above, adding it manually
  // A lot less complex
  // Also theres a weird edge case where -0 is returned, using a ternary to just return 0
  resultAtEachStrike.push(costBasis === 0 ? 0 : costBasis * -1)

  const maxLoss = Math.min(...resultAtEachStrike)
  const maxGain = Math.max(...resultAtEachStrike)

  return {
    ticker: underlying,
    side: determineSide(costBasis),
    maxLoss,
    maxGain,
    fullyCovered: onlyUnderlying.reduce((acc, pos) => acc + pos.quantity, 0) === 0,
  }
}