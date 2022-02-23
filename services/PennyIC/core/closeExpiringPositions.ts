import * as tradier from '@penny/tradier'
import { getExpiration, getUnderlying } from '@penny/option-symbol-parser'
import { MultilegOptionLeg } from '@penny/tradier'


export const closeExpiringPositions = async () => {
  const positions = await tradier.getPositions()
  const spreads = tradier.groupOptionsIntoSpreads(positions)
  const allSpreads = [ ...spreads.call.spreads, ...spreads.put.spreads ]

  const today = new Date().toISOString().split('T')[0]
  const expiringToday = allSpreads.filter(spread => getExpiration(spread.short) === today)

  for (let x = 0; x < expiringToday.length; x++) {
    const spread = expiringToday[x]
    const underlying = getUnderlying(spread.short)
    const legs: MultilegOptionLeg[] = [
      {
        symbol: spread.short,
        side: 'buy_to_close',
        quantity: 1
      },
      {
        symbol: spread.long,
        side: 'sell_to_close',
        quantity: 1
      },
    ]
    await tradier.multilegOptionOrder(underlying, 'market', legs)
  }
}