import { callTradierHelper } from './callTradierHelper'

export type TradierPrice = {
  symbol: string,
  price: number,
}

export const getPrices = async (symbols: string[]) : Promise<TradierPrice[]> => {
  if (symbols.length === 0) {
    return []
  }

  const response = await callTradierHelper(`markets/quotes?symbols=${symbols.join(',')}`, 'quotes', 'quote', true)
  return response.map(quote => ({
    symbol: quote.symbol,
    price: quote.ask,
  }))
}
