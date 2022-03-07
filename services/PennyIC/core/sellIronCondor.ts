import * as tradier from '@penny/tradier'
import { isOption, getUnderlying, getType } from '@penny/option-symbol-parser'
import { OptionChainLink, MultilegOptionLeg } from '@penny/tradier'
import { uniq } from 'lodash'


type ChainLinkWithDeltaDist = OptionChainLink & {
  distanceToDeltaTarget: number,
}


const _insertDistanceToTargetDelta = (chain: OptionChainLink[], targetDelta: number) : ChainLinkWithDeltaDist[] =>
  chain.map(link => ({
    ...link,
    distanceToDeltaTarget: Math.abs(targetDelta - link.delta)
  }))


const _selectLinkClosestToTarget = (chain: ChainLinkWithDeltaDist[]): ChainLinkWithDeltaDist =>
  chain.reduce((acc, link) => link.distanceToDeltaTarget < acc.distanceToDeltaTarget ? link : acc, chain[0])



export const sellSpread = async (chain: OptionChainLink[], symbol: string, type: 'call' | 'put' | 'neither', shortDelta: number, targetStrikeWidth: number): Promise<void> => {
  try {
    if (type === 'neither') {
      return
    }

    const typeChain = chain.filter(x => x.type === type)
    const typeChainWithDist = _insertDistanceToTargetDelta(typeChain, shortDelta)
    const shortLink = _selectLinkClosestToTarget(typeChainWithDist)
  
    // Different filter params depending on the type
    const filterFunc = type === 'put' ?
      (link: OptionChainLink) => (shortLink.strike - link.strike) <= targetStrikeWidth && link.strike < shortLink.strike
      : (link: OptionChainLink) => (link.strike - shortLink.strike) <= targetStrikeWidth && link.strike > shortLink.strike
  
    // After non-candidates for long is filtered out, this will modify the array (or not)
    // The selection will be the strike with the largest distance from the short strike
    // For calls, the chain has to be reversed to make the selection
    const modifier = type === 'put' ?
      (chain: OptionChainLink[]) => chain :
      (chain: OptionChainLink[]) => chain.reverse()
  
    const longLinkOptions = modifier(typeChainWithDist.filter(filterFunc))
  
    if (longLinkOptions.length === 0) {
      return
    }
  
    const longLink = longLinkOptions[0]
  
    const legs: MultilegOptionLeg[] = [
      {
        symbol: shortLink.symbol,
        side: 'sell_to_open',
        quantity: 1
      },
      {
        symbol: longLink.symbol,
        side: 'buy_to_open',
        quantity: 1
      }
    ]
  
    // SELL SELL SELL
    await tradier.multilegOptionOrder(symbol, 'credit', legs)
  } catch (e) {
    // TODO Log error
  }
}




export const sellIronCondor = async (symbol: string, shortDelta: number, targetStrikeWidth: number, put: boolean = true, call: boolean = true, minDTE = 30) => {
  try {
    if (!put && !call) {
      return
    }

    const expirations = await tradier.getExpirations(symbol, 100)
    if (!expirations || expirations.length === 0) {
      return
    }


    // At least 30 days out
    // TODO Make this a setting
    const minDiff = (8.64e+7 * minDTE) // 8.64e+7 is how many milliseconds there are in a day
    const today = new Date().getTime()
    console.log(expirations)
    const expiration = expirations.find(x => (new Date(x).getTime() - today) >= minDiff)

    if (!expiration) {
      return
    }

    const chain = await tradier.getOptionChain(symbol, expiration)

    if (put) {
      await sellSpread(chain, symbol, 'put', shortDelta, targetStrikeWidth)
    }
    if (call) {
      await sellSpread(chain, symbol, 'call', shortDelta, targetStrikeWidth)
    }
  } catch (e) {
    // TODO Log error
  }
}




export const sellIronCondorBigThree = async () => {
  const bigThree = [ 'SPY', 'IWM', 'QQQ' ]

  // TODO Is bigThree enabled?

  // Is market open?
  const isOpen = await tradier.isMarketOpen()
  if (!isOpen) {
    return
  }

  // TODO Get big three settings (individual)
    // Enabled?
    // Short delta
    // maxStrikeWidth

  for (let x = 0; x < bigThree.length; x++) {
    console.log(bigThree[x])
    await sellIronCondor(bigThree[x], 0.1, 1)
  }
}


export const sellIronCondors = async () => {
  // TODO Is iron condor enabled?

  // Is market open?
  const isOpen = await tradier.isMarketOpen()
  if (!isOpen) {
    return
  }

  // TODO get stocks from DB
  const symbols = [
    'DIA', 'AAPL', 'TSLA', 'MSFT', 'BAC', 'WFC', 'FB', 'PTON', 'AMC', 'F',
    'SNDL', 'AMZN', 'DIS', 'NIO', 'LCID', 'NFLX', 'PFE', 'NVDA', 'AAL', 'SNAP', 'PLUG', 'HOOD',
    'GPRO', 'BABA', 'CCL', 'ACB', 'NOK', 'DAL', 'UAL', 'PLTR', 'GME', 'SBUX', 'AMD',
    'COIN', 'TLRY', 'TWTR', 'RIVN', 'T', 'KO', 'CGC', 'GOOG', 'MRNA', 'SPCE', 'BB', 'PYPL', 'UBER',
    'GM', 'ZNGA', 'NCLH', 'WKHS', 'SQ', 'DKNG', 'ABNB', 'BA', 'WMT',
    'JNJ', 'CHPT', 'LUV', 'MRO', 'ARKK', 'RIOT', 'XOM', 'SOFI', 'WISH', 'SONY',
    'PENN', 'COST', 'ZM', 'JPM',
    'RCL', 'CLOV', 'ET', 'INTC', 'V', 'TSM', 'FUBO', 'MA',
    'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY'
  ]

  // TODO Filter for enabled
    // Map out just symbols


  const positions = await tradier.getPositions()
  const openOptions = positions.filter(x => isOption(x.symbol))
  const openOptionSymbols = openOptions.map(x => x.symbol)

  const orders = await tradier.getOrders()
  const multilegOrders = orders.filter(x => x.class === 'multileg' && (x.status === 'open' || x.status === 'pending'))
  const legs = multilegOrders.reduce((acc, x) => [ ...acc, ...x.leg ], [])
  const openOrderSymbols = legs.map(x => x.option_symbol)

  const openSymbols = uniq([ ...openOptionSymbols, ...openOrderSymbols ])

  // Map out what symbols have open positions or orders for calls/puts
  const openPositionTypes = symbols.map(symbol => ({
    symbol,
    hasCall: openSymbols.some(openSymbol => getUnderlying(openSymbol) === symbol && getType(openSymbol) === 'call'),
    hasPut: openSymbols.some(openSymbol => getUnderlying(openSymbol) === symbol && getType(openSymbol) === 'put'),
  }))


  for (let x = 0; x < openPositionTypes.length; x++) {
    const position = openPositionTypes[x]
    await sellIronCondor(position.symbol, 0.15, 1, !position.hasPut, !position.hasCall)
  }
}