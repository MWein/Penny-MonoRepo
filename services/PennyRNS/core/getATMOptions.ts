import * as tradier from '@penny/tradier'
import { RNSModel } from '@penny/db-models'
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
    await tradier.buyToOpen(underlying, option.symbol, 1)
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
