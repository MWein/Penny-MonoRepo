import * as tradier from '@penny/tradier'
import { RNSModel, PriceHistoryModel } from '@penny/db-models'
import { uniq } from 'lodash'

const saveOptPricesBatch = async (limit, offset) => {
  const today = new Date()
  const currentDate = new Date().toISOString().split('T')[0]

  const filter = {
    expiration: { $gte: currentDate },
  }

  const matchingOptions = await RNSModel.find(filter)
    .select('symbol')
    .limit(limit)
    .skip(offset)
    .sort({ symbol: 1 })
    .lean()

  if (matchingOptions.length === 0) {
    return false
  }

  const symbols = uniq(matchingOptions.map(x => x.symbol))
  const tradierPrices = await tradier.getPrices(symbols)
  const currentPrices = tradierPrices.map(x => ({
    ...x,
    price: Number((x.price * 100).toFixed(0)),
    date: today,
  }))

  //await PriceHistoryModel.insertMany(currentPrices)

  for (let x = 0; x < currentPrices.length; x++) {
    // Update main table
    const priceListing = currentPrices[x]
    await RNSModel.updateMany({ symbol: priceListing.symbol }, {
      $push: {
        history: {
          price: priceListing.price,
          date: priceListing.date,
        }
      }
    })
  }

  return true
}


export const saveOptPrices = async () => {
  const limit = 400 // Should be divisible by 200 for efficiency
  let offset = 0
  while(true) {
    console.log(offset)
    const hasMore = await saveOptPricesBatch(limit, offset)
    if (!hasMore) {
      break
    }
    offset += limit
  }
  console.log('Done')
}