import * as network from './network'

export type TradierHistoricalQuote = {
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

export const getHistoricalQuote = async (symbol: string, start: string, end: string) : Promise<TradierHistoricalQuote[]> => {
  const url = `markets/history?symbol=${symbol}&start=${start}&end=${end}`
  const response = await network.get(url)
  
  if (response.history === null) {
    return []
  }
  
  const quotes = response.history.day

  // Why do they do this?
  if (Array.isArray(quotes)) {
    return quotes
  } else {
    return [
      quotes
    ]
  }
}
