import * as tradier from '@penny/tradier'
import { getUnderlying, getStrike, getType } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'


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

  const spreadTickers = uniq(allSpreads.map(spread => getUnderlying(spread.short)))
  const prices = await tradier.getPrices(spreadTickers)
  const priceMap = prices.reduce((acc, price) => ({ ...acc, [price.symbol]: price.price }), {})

  const spreadsWithDist = allSpreads
    .map(spread => ({ ...spread, dist: getDistanceFromPrice(spread, priceMap) }))


  // TODO Get settings for all tickers for minimum distance


  console.log(spreadsWithDist)

}