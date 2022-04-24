import * as tradier from '@penny/tradier'
import { getExpiration, isOption } from '@penny/option-symbol-parser'
import { closePositions } from '../common/closePositions'


export const closeExpiringPositions = async () => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  const today = new Date().toISOString().split('T')[0]
  const expiringToday = optionPositions.filter(pos => getExpiration(pos.symbol) === today)

  // Close expiring positions
  const orders = await tradier.getOrders()
  const openOrders = orders.filter(ord => ord.status === 'open' && ord.class === 'multileg')
  const expiringSymbols = expiringToday.map(pos => pos.symbol)
  const ordersWithExpiringPositions = openOrders.filter(ord => {
    const symbolKeys = Object.keys(ord).filter(key => key.includes('option_symbol['))
    const symbols = symbolKeys.map(key => ord[key])
    return symbols.some(symbol => expiringSymbols.includes(symbol))
  }).map(ord => ord.id)

  if (ordersWithExpiringPositions.length > 0) {
    await tradier.cancelOrders(ordersWithExpiringPositions)
  }

  await closePositions(expiringToday)
}