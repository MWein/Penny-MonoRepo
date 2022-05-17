import * as tradier from '@penny/tradier'
import { RNSModel } from '@penny/db-models'

export const getATMOptions = async (symbol: string, prices: tradier.TradierPrice[]) => {
  try {
    const expirations = await tradier.getExpirations(symbol, 10)
    if (!expirations || expirations.length === 0) {
      return null
    }
  
    const expiration = expirations[0]
  
    if (!expiration) {
      return null
    }
  
    const currentPrice = prices.find(x => x.symbol === symbol)?.price
    if (!currentPrice) {
      return null
    }

    const chain = await tradier.getOptionChain(symbol, expiration)
    const putChain = chain.filter(link => link.type === 'put')
    const callChain = chain.filter(link => link.type === 'call')
  
    const atmPutLink = putChain.filter(link => link.strike < currentPrice).reverse()[0]
    const atmCallLink = callChain.filter(link => link.strike > currentPrice)[0]

    const putPerc = Number((atmPutLink.premium / atmPutLink.strike).toFixed(2))
    const callPerc = Number((atmCallLink.premium / atmCallLink.strike).toFixed(2))
    const diff = putPerc - callPerc

    const put = {
      ...atmPutLink,
      price: currentPrice,
      perc: putPerc,
      diff,
    }

    const call = {
      ...atmCallLink,
      price: currentPrice,
      perc: callPerc,
      diff,
    }

    return {
      put,
      call,
    }
  } catch (e) {
    return null
  }
}

const symbols = require('../core/weeklyTickers.json')

export const selectThemTest = async () => {
  const start = new Date()

  const prices = await tradier.getPrices(symbols)

  const selectedOptions = []
  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x]
    console.log(symbol)
    const atmOpts = await getATMOptions(symbol, prices)
    if (atmOpts) {
      selectedOptions.push(atmOpts.put)
      selectedOptions.push(atmOpts.call)

      const putModel = new RNSModel(atmOpts.put)
      const callModel = new RNSModel(atmOpts.call)

      await Promise.all([
        putModel.save(),
        callModel.save(),
      ])
    }
  }

  const sortedOpts = selectedOptions.sort((a, b) => b.perc - a.perc).filter(x => x.perc > 5).reverse()
  console.log(sortedOpts)

  const end = new Date()
  console.log(end.valueOf() - start.valueOf())
}


export const checkThemTest = async () => {
  const filter = {
    perc: { $gte: 5 },
    price: { $gte: 10 },
    type: 'put',
    premium: { $lte: 1000 },
    date: '2022-05-16'
  }

  const matchingOptions = await RNSModel.find(filter).sort({ perc: -1 }).lean()
  const tradierPrices = await tradier.getPrices(matchingOptions.map(x => x.symbol))
  const currentPrices = tradierPrices.map(x => ({ ...x, price: Number((x.price * 100).toFixed(0)) }))

  const optionsWithProfit = matchingOptions.map(opt => {
    const currentPrice = currentPrices.find(x => x.symbol === opt.symbol).price
    const profit = currentPrice - opt.premium

    return {
      ...opt,
      currentPrice,
      profit,
    }
  })

  console.log(optionsWithProfit)

  // [X]  "Bought" on Monday
    // Sold on Monday: $2110
    // Sold on Tuesday: 
    // Sold on Wednesday:
    // Sold on Thursday:
    // Sold on Friday:

  // [ ] "Bought" on Tuesday
    // Sold on Tuesday: 
    // Sold on Wednesday:
    // Sold on Thursday:
    // Sold on Friday:

  // [ ] "Bought" on Wednesday
    // Sold on Wednesday:
    // Sold on Thursday:
    // Sold on Friday:

  // [ ] "Bought" on Thursday
    // Sold on Thursday:
    // Sold on Friday:

  // [ ]  "Bought" on Friday
    // Sold on Friday:

  console.log(`Premium $${optionsWithProfit.reduce((acc, x) => acc + x.premium, 0)}`)
  console.log(`Profit: $${optionsWithProfit.reduce((acc, x) => acc + x.profit, 0)}`)
}
