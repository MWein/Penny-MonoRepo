import * as tradier from '@penny/tradier'
import { getUnderlying, getStrike, getType, getExpiration } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'
import * as sellIronCondor from './sellIronCondor'
import * as logger from '@penny/logger'
import { closeSpreads } from '../common/closeSpreads'


type SpreadWithDistance = {
  dist: number,
  short: string,
  long: string
}



// Returns the distance between the short strike and the current price
const getDistanceFromPrice = (spread: { short: string, long: string }, priceMap: object) : number => {
  const price = priceMap[getUnderlying(spread.short)]
  const shortStrike = getStrike(spread.short)
  return getType(spread.short) === 'call' ? shortStrike - price : price - shortStrike
}



export const openNewWings = async (closedSpreads: SpreadWithDistance[]) : Promise<void> => {
  const newWingsToOpen = closedSpreads.map(spread => ({
    type: getType(spread.short),
    symbol: getUnderlying(spread.short),
    expiration: getExpiration(spread.short)
  }))

  for (let x = 0; x < newWingsToOpen.length; x++) {
    const { symbol, type, expiration } = newWingsToOpen[x]
    
    // TODO Get settings for this symbol

    const chain = await tradier.getOptionChain(symbol, expiration)
    await sellIronCondor.sellSpread(chain, symbol, type, 0.15, 1)
  }
}



export const wingAdjustment = async () : Promise<void> => {
  // TODO Is wingAdjustment enabled

  // is market open
  const isOpen = await tradier.isMarketOpen()
  if (!isOpen) {
    return
  }

  const today = new Date().toISOString().split('T')[0]
  const positions = await tradier.getPositions()

  // Filter out ones opened today
  const positionsNotOpenedToday = positions.filter(pos => pos.date_acquired.split('T')[0] !== today)

  const spreadGroupResults = tradier.groupOptionsIntoSpreads(positionsNotOpenedToday)
  const allSpreads = [ ...spreadGroupResults.call.spreads, ...spreadGroupResults.put.spreads ]

  const spreadTickers = uniq(allSpreads.map(spread => getUnderlying(spread.short)))
  const prices = await tradier.getPrices(spreadTickers)
  const priceMap = prices.reduce((acc, price) => ({ ...acc, [price.symbol]: price.price }), {})

  const spreadsWithDist = allSpreads
    .map(spread => ({ ...spread, dist: getDistanceFromPrice(spread, priceMap) }))

  // TODO Get settings for all tickers for minimum distance
  // For now, it will just be zero and applied to all of them
  const spreadsToClose = spreadsWithDist.filter(spread => spread.dist <= 0)

  if (spreadsToClose.length > 0) {
    logger.log({
      type: 'info',
      message: 'WING ADJUSTMENT HAPPENED'
    })
  }

  await closeSpreads(spreadsToClose)

// Filter out ones that expire today
  const spreadsNotExpiringToday = spreadsToClose.filter(spread => getExpiration(spread.short) !== today)

  await openNewWings(spreadsNotExpiringToday)
}