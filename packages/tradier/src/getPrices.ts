import { callTradierHelper } from './callTradierHelper'
import { chunk } from 'lodash'

export type TradierPrice = {
  symbol: string,
  price: number,
}

export const getPrices = async (symbols: string[]) : Promise<TradierPrice[]> => {
  if (symbols.length === 0) {
    return []
  }

  const batches = chunk(symbols, 200)

  const results = []
  for (let x = 0; x < batches.length; x++) {
    const batch = batches[x]

    const response = await callTradierHelper(`markets/quotes?symbols=${batch.join(',')}`, 'quotes', 'quote', true)
    const batchResults = response.map(quote => {
      return {
        symbol: quote.symbol,
        price: quote.last,
      }
    })

    results.push(...batchResults)
  }

  return results
}
