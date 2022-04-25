import { getOrders } from './getOrders'
import { cancelOrders, multilegOptionOrder } from './sendOrder'

import { getUnderlying, isOption } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'
import { MultilegOptionLeg } from '@penny/tradier'
import * as sleepUtil from '@penny/sleep'


const closePositions = async positions => {
  if (positions.length === 0) {
    return
  }

  const optionPositions = positions.filter(pos => isOption(pos.symbol))


  // Close any open orders
  const orders = await getOrders()
  const openOrders = orders.filter(ord => ord.status === 'open' && ord.class === 'multileg')
  const expiringSymbols = optionPositions.map(pos => pos.symbol)
  const ordersWithExpiringPositions = openOrders.filter(ord => {
    const symbolKeys = Object.keys(ord).filter(key => key.includes('option_symbol['))
    const symbols = symbolKeys.map(key => ord[key])
    return symbols.some(symbol => expiringSymbols.includes(symbol))
  }).map(ord => ord.id)

  if (ordersWithExpiringPositions.length > 0) {
    await cancelOrders(ordersWithExpiringPositions)
    sleepUtil.sleep(10)
  }


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

    await multilegOptionOrder(underlying, 'market', legs)
  }
}

export {
  closePositions
}