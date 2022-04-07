import * as tradier from '@penny/tradier'
import { getUnderlying, isOption } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'
import { MultilegOptionLeg } from '@penny/tradier'


const closePositions = async positions => {
  const optionPositions = positions.filter(pos => isOption(pos.symbol))
  const underlyingSymbols = uniq(optionPositions.map(pos => getUnderlying(pos.symbol)))

  for (let x = 0; x < underlyingSymbols.length; x++) {
    const underlying = underlyingSymbols[x]
    const positionsWithUnderlying = optionPositions.filter(pos => getUnderlying(pos.symbol) === underlying)

    const legs: MultilegOptionLeg[] = positionsWithUnderlying.map(pos => {
      const side = pos.quantity > 0 ? 'sell_to_close' : 'buy_to_close'
      return {
        symbol: pos.symbol,
        side,
        quantity: 1
      }
    })

    await tradier.multilegOptionOrder(underlying, 'market', legs)
  }
}

export {
  closePositions
}