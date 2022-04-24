import * as tradier from '@penny/tradier'
import { isOption, getUnderlying, getType } from '@penny/option-symbol-parser'
import { OptionChainLink, MultilegOptionLeg } from '@penny/tradier'
import { getSpreadOutcomes } from '@penny/spread-outcome'
import { pickRandomTickers } from '../common/pickRandomTickers'


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



// Modified function that goes for a premium spread rather than a delta target
export const sellSpreadByPremium = async (chain: OptionChainLink[], symbol: string, type: 'call' | 'put' | 'neither', premiumTarget: number, targetStrikeWidth: number): Promise<void> => {
  try {
    if (type === 'neither') {
      return
    }

    const typeChain = chain.filter(x => x.type === type)
    const typeChainOrdered = type === 'call' ? typeChain.reverse() : typeChain

    let longLink
    const shortLink = typeChainOrdered.find((shortCandidate, index) => {
      if (index === 0) {
        return false
      }

      const shortCandidatePremium = shortCandidate.premium

      // Some chains have a strike spread less than the target. Find a good one
      for (let x = index - 1; x >= 0; x--) {
        longLink = typeChainOrdered[x]
        if (!(Math.abs(longLink.strike - shortCandidate.strike) < targetStrikeWidth)) {
          break
        }
      }

      const longCandidatePremium = longLink.premium

      const netPremium = shortCandidatePremium - longCandidatePremium
      return netPremium >= premiumTarget
    })

    // Too high a delta
    if (!shortLink || shortLink.delta >= 0.30) {
      return
    }

    // Strike width too wide
    if (Math.abs(shortLink.strike - longLink.strike) > targetStrikeWidth) {
      return
    }
  
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

    await tradier.multilegOptionOrder(symbol, 'credit', legs, 0.14)
  } catch (e) {
    // TODO Log error
  }
}




export const sellSpread = async (chain: OptionChainLink[], symbol: string, type: 'call' | 'put' | 'neither', shortDelta: number, targetStrikeWidth: number): Promise<void> => {
  try {
    if (type === 'neither') {
      return
    }

    const typeChain = chain.filter(x => x.type === type)
    const typeChainWithDist = _insertDistanceToTargetDelta(typeChain, shortDelta)
    const shortLink = _selectLinkClosestToTarget(typeChainWithDist)
  
    // Too far from target delta
    if (shortLink.distanceToDeltaTarget > 0.10) {
      return
    }

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




export const sellIronCondor = async (symbol: string, shortDelta: number, targetStrikeWidth: number, minDTE = 30) => {
  try {
    const expirations = await tradier.getExpirations(symbol, 100)
    if (!expirations || expirations.length === 0) {
      return
    }

    // At least 30 days out
    // TODO Make this a setting
    const minDiff = (8.64e+7 * minDTE) // 8.64e+7 is how many milliseconds there are in a day
    const today = new Date().getTime()
    const expiration = expirations.find(x => (new Date(x).getTime() - today) >= minDiff)


    if (!expiration) {
      return
    }

    const chain = await tradier.getOptionChain(symbol, expiration)

    await sellSpreadByPremium(chain, symbol, 'put', shortDelta, targetStrikeWidth)
    await sellSpreadByPremium(chain, symbol, 'call', shortDelta, targetStrikeWidth)
  } catch (e) {
    // TODO Log error
  }
}



export const sellIronCondors = async () => {
  // TODO Make these settings
  const sellICEnabled = true
  const targetDelta = 15
  const minDTE = 30
  const sellPerDay = 10
  const targetStrikeWidth = 1

  if (!sellICEnabled) {
    return
  }

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
    'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLU', 'XLV', 'XLY',

    'SPY', 'IWM', 'QQQ',

    // Leveraged
    'TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN'
  ]

  // TODO Filter for enabled
    // Map out just symbols


  const positions = await tradier.getPositions()
  const openOptions = positions.filter(x => isOption(x.symbol))

  const openSpreads = getSpreadOutcomes(openOptions)
  const shortSpreads = openSpreads.filter(spread => spread.side === 'short')
  const tickersToIgnore = shortSpreads.map(spread => spread.ticker)  
  const tickersToChooseFrom = symbols.filter(symbol => !tickersToIgnore.includes(symbol))

  if (tickersToChooseFrom.length === 0) {
    return
  }

  // Hacky... get a 30 day out expiration date for AAPL
  // TODO Should be in its own function since this is repeated
  const expirations = await tradier.getExpirations('AAPL', 100)
  if (!expirations || expirations.length === 0) {
    return
  }
  const minDiff = (8.64e+7 * minDTE) // 8.64e+7 is how many milliseconds there are in a day
  const today = new Date().getTime()
  const expiration = expirations.find(x => (new Date(x).getTime() - today) >= minDiff)
  // TODO Should be in its own function since this is repeated

  const tickersToSell = await pickRandomTickers(tickersToChooseFrom, sellPerDay, targetStrikeWidth, expiration)

  for (let x = 0; x < tickersToSell.length; x++) {
    const position = tickersToSell[x]
    await sellIronCondor(position, targetDelta, targetStrikeWidth, minDTE)
  }
}