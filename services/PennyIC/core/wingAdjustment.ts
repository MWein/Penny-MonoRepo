import * as tradier from '@penny/tradier'
import { getUnderlying, getStrike, getType } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'


// Returns the distance between the short strike and the current price
const getDistanceFromPrice = (spread: { short: string, long: string }, priceMap: object) => {
  const underlying = getUnderlying(spread.short)
  const type = getType(spread.short)
  const price = priceMap[underlying]
  const shortStrike = getStrike(spread.short)

  console.log(type)
  console.log('Price', price)
  console.log('Strike', shortStrike)

  return type === 'call' ? shortStrike - price : price - shortStrike
}


export const wingAdjustment = async () => {
  // TODO Is wingAdjustment enabled

  // TODO is market open

  const positions = await tradier.getPositions()
  const spreadGroupResults = tradier.groupOptionsIntoSpreads(positions)
  const allSpreads = [ ...spreadGroupResults.call.spreads, ...spreadGroupResults.put.spreads ]

  const spreadTickers = uniq(allSpreads.map(spread => getUnderlying(spread.short)))
  const prices = await tradier.getPrices(spreadTickers)
  const priceMap = prices.reduce((acc, price) => ({ ...acc, [price.symbol]: price.price }), {})

  const spreadsWithDist = allSpreads
    .map(spread => ({ ...spread, dist: getDistanceFromPrice(spread, priceMap) }))


  console.log(spreadsWithDist)

}