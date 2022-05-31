import { getOrders } from './getOrders'
import { cancelOrders, multilegOptionOrder, sellToClose, buyToCloseMarket } from './sendOrder'

import { getUnderlying, isOption } from '@penny/option-symbol-parser'
import { uniq, chunk } from 'lodash'
import { MultilegOptionLeg, Position } from '@penny/tradier'
import * as sleepUtil from '@penny/sleep'


const closePositions = async (positions: Position[]) => {
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


  const underlyingSymbols: string[] = uniq(optionPositions.map(pos => getUnderlying(pos.symbol)))

  for (let x = 0; x < underlyingSymbols.length; x++) {
    const underlying: string = underlyingSymbols[x]
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


const closePositionsIndividual = async (positions: Position[]) => {
  const optionPositions = positions.filter(pos => isOption(pos.symbol))
  if (optionPositions.length === 0) {
    return
  }

  // TODO Cancel any open orders

  const chunks = chunk(optionPositions, 10)

  for (let x = 0; x < chunks.length; x++) {
    const chunk = chunks[x]
    await Promise.all(chunk.map(async pos => {
      // Long
      if (pos.quantity > 0) {
        await sellToClose(getUnderlying(pos.symbol), pos.symbol, pos.quantity)
      } else {
        await buyToCloseMarket(getUnderlying(pos.symbol), pos.symbol, pos.quantity * -1)
      }
    }))
  }
}


export {
  closePositions,
  closePositionsIndividual,
}