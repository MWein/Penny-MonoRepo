import * as tradier from '@penny/tradier'


export const getATMPut = async (symbol: string, prices: tradier.TradierPrice[]) => {
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
  
    const atmLink = putChain.filter(link => link.strike < currentPrice).reverse()[0]
    if (!atmLink) {
      return null
    }

    return {
      ...atmLink,
      price: currentPrice,
      perc: Number((atmLink.premium / atmLink.strike).toFixed(2))
    }
  } catch (e) {
    return null
  }
}


export const selectPuts = async () => {
  // TODO Get from database
  const symbols = [
    'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
    'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
    'GPRO', 'BABA', 'CCL', 'ACB', 'NOK', 'DAL', 'UAL', 'PLTR', 'GME', 'SBUX', 'AMD',
    'COIN', 'TLRY', 'TWTR', 'RIVN', 'T', 'KO', 'CGC', 'GOOG', 'MRNA', 'SPCE', 'BB', 'PYPL', 'UBER',
    'GM', 'ZNGA', 'NCLH', 'WKHS', 'SQ', 'DKNG', 'ABNB', 'BA', 'WMT',
    'JNJ', 'CHPT', 'LUV', 'MRO', 'ARKK', 'RIOT', 'XOM', 'SOFI', 'WISH', 'SONY',
    'PENN', 'COST', 'ZM', 'JPM',
    'RCL', 'CLOV', 'ET', 'INTC', 'V', 'TSM', 'FUBO', 'MA',
    'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY',

    'SPY', 'IWM', 'QQQ',
  ]

  const prices = await tradier.getPrices(symbols)
  

  const selectedPuts = []
  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x]
    console.log(symbol)
    const atmPut = await getATMPut(symbol, prices)
    if (atmPut) {
      selectedPuts.push(atmPut)
    }
  }

  const sortedPuts = selectedPuts.sort((a, b) => b.perc - a.perc)

  console.log(sortedPuts)


}