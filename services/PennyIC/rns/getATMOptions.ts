import * as tradier from '@penny/tradier'
import { RNSModel } from '@penny/db-models'
import { uniq } from 'lodash'
import { getUnderlying } from '@penny/option-symbol-parser'

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


const evalAndPurchase = async (option) => {
  let shouldPurchase = false

  // Extremely low volatility options
  if (option.perc <= 0.3 && option.price >= 10 && option.premium >= 30 && option.premium < 1000) {
    shouldPurchase = true
  }

  // Extremely high volatility put options
  if (option.type === 'put' && option.perc >= 5 && option.price >= 5 && option.premium <= 1000) {
    shouldPurchase = true
  }

  if (shouldPurchase) {
    const underlying = getUnderlying(option.symbol)
    tradier.buyToOpen(underlying, option.symbol, 1)
  }
}


export const saveAndPurchase = async () => {
  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x]
    console.log(symbol)
    const prices = await tradier.getPrices([symbol])
    const atmOpts = await getATMOptions(symbol, prices)
    if (atmOpts) {
      // Evaluation and purchase if pass
      await evalAndPurchase(atmOpts.put)
      await evalAndPurchase(atmOpts.call)

      // Save to DB
      const putModel = new RNSModel(atmOpts.put)
      const callModel = new RNSModel(atmOpts.call)
      await Promise.all([
        putModel.save(),
        callModel.save(),
      ])
    }
  }
}


export const checkThemTest = async () => {
  const date = '2022-05-17'

  // const filter = {
  //   perc: { $gte: 5 },
  //   price: { $gte: 10 },
  //   type: 'put',
  //   premium: { $lte: 1000 },
  //   date,
  // }
  // const matchingOptions1 = await RNSModel.find(filter).sort({ perc: -1 }).lean()

  const filter2 = {
    perc: { $lte: 0.3 },
    price: { $gte: 10 },
    //type: 'call',
    premium: { $lte: 1000, $gte: 30 },
    date,
  }
  const matchingOptions2 = await RNSModel.find(filter2).sort({ perc: 1 }).lean()

  const matchingOptions = [ ...matchingOptions2, /*...matchingOptions2 */]


  const tradierPrices = await tradier.getPrices(matchingOptions.map(x => x.symbol))

  console.log(tradierPrices)

  const currentPrices = tradierPrices.map(x => ({ ...x, price: Number((x.price * 100).toFixed(0)) }))

  const optionsWithProfit = matchingOptions.map(opt => {
    const currentPrice = currentPrices.find(x => x.symbol === opt.symbol)?.price || opt.premium
    const profit = currentPrice - opt.premium

    return {
      ...opt,
      currentPrice,
      profit,
    }
  })

  console.log(optionsWithProfit)

  console.log(`Premium $${optionsWithProfit.reduce((acc, x) => acc + x.premium, 0)}`)
  console.log(`Profit: $${optionsWithProfit.reduce((acc, x) => acc + x.profit, 0)}`)
}
