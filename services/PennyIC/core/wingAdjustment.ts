import * as tradier from '@penny/tradier'
import { getUnderlying, getStrike, getType, getExpiration } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'
import * as sellIronCondor from './sellIronCondor'
import { MultilegOptionLeg } from '@penny/tradier'



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



export const closeBadWings = async (spreadsToClose: SpreadWithDistance[]) : Promise<void> => {
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
    await tradier.multilegOptionOrder(underlying, 'market', legs)
  }))
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

  // Filter out ones that expire today
  const spreadsNotExpiringToday = allSpreads.filter(spread => getExpiration(spread.short) !== today)

  const spreadTickers = uniq(spreadsNotExpiringToday.map(spread => getUnderlying(spread.short)))
  const prices = await tradier.getPrices(spreadTickers)
  const priceMap = prices.reduce((acc, price) => ({ ...acc, [price.symbol]: price.price }), {})

  const spreadsWithDist = spreadsNotExpiringToday
    .map(spread => ({ ...spread, dist: getDistanceFromPrice(spread, priceMap) }))

  // TODO Get settings for all tickers for minimum distance
  // For now, it will just be zero and applied to all of them
  const spreadsToClose = spreadsWithDist.filter(spread => spread.dist <= 0)

  await closeBadWings(spreadsToClose)
  await openNewWings(spreadsToClose)
}