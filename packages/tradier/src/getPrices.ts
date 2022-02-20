import * as network from './network'

type TradierPrice = {
  symbol: string,
  price: number,
}

export const getPrices = async (symbols: string[]) : Promise<TradierPrice[]> => {
  if (symbols.length === 0) {
    return []
  }

  const symbolQuery = symbols.join(',')
  const url = `markets/quotes?symbols=${symbolQuery}`
  const response = await network.get(url)
  const quotes = response.quotes.quote

  // Why do they do this?
  if (Array.isArray(quotes)) {
    return response.quotes.quote.map(quote => ({
      symbol: quote.symbol,
      price: quote.ask,
    }))
  } else {
    return [
      {
        symbol: quotes.symbol,
        price: quotes.ask,
      }
    ]
  }
}
