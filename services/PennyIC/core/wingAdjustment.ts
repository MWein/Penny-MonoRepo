import * as tradier from '@penny/tradier'
import { getUnderlying, getStrike, getType } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'

import { MultilegOptionLeg } from '@penny/tradier'


// Returns the distance between the short strike and the current price
const getDistanceFromPrice = (spread: { short: string, long: string }, priceMap: object) => {
  const price = priceMap[getUnderlying(spread.short)]
  const shortStrike = getStrike(spread.short)
  return getType(spread.short) === 'call' ? shortStrike - price : price - shortStrike
}


export const wingAdjustment = async () => {
  // TODO Is wingAdjustment enabled

  // TODO is market open

  const positions = await tradier.getPositions()
  const spreadGroupResults = tradier.groupOptionsIntoSpreads(positions)
  const allSpreads = [ ...spreadGroupResults.call.spreads, ...spreadGroupResults.put.spreads ]

  // TODO Filter out ones that expire today

  const spreadTickers = uniq(allSpreads.map(spread => getUnderlying(spread.short)))
  const prices = await tradier.getPrices(spreadTickers)
  const priceMap = prices.reduce((acc, price) => ({ ...acc, [price.symbol]: price.price }), {})

  const spreadsWithDist = allSpreads
    .map(spread => ({ ...spread, dist: getDistanceFromPrice(spread, priceMap) }))

  // TODO Get settings for all tickers for minimum distance
  // For now, it will just be zero and applied to all of them
  const spreadsToClose = spreadsWithDist.filter(spread => spread.dist <= 0)

  // Sending close orders and opening new ones should be done in different loops
  // So the closes are sent ASAP. Opening the new positions will take awhile

  // Send close orders
  await Promise.all(spreadsToClose.map(async spread => {
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
    //await tradier.multilegOptionOrder(underlying, 'market', legs)
  }))


  const newWingsToOpen = spreadsToClose.map(spread => ({
    type: getType(spread.short),
    symbol: getUnderlying(spread.short)
  }))

  console.log(newWingsToOpen)

  // Open new positions
  // for (let x = 0; x < spreadsToClose.length; x++) {
  //   const spreadToClose = spreadsToClose[x]


  // }

}