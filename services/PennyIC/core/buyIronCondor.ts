import * as tradier from '@penny/tradier'
import { isOption, getUnderlying, getType } from '@penny/option-symbol-parser'
import { OptionChainLink, MultilegOptionLeg } from '@penny/tradier'
import { getSpreadOutcomes } from '@penny/spread-outcome'


// Modified function that goes for a premium spread rather than a delta target
// TODO After writing tests for this, change "short" and "long" so future me doesn't get confused
export const buySpreadByPremium = async (chain: OptionChainLink[], symbol: string, type: 'call' | 'put' | 'neither', premiumTarget: number, targetStrikeWidth: number): Promise<void> => {
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
        side: 'buy_to_open',
        quantity: 1
      },
      {
        symbol: longLink.symbol,
        side: 'sell_to_open',
        quantity: 1
      }
    ]

    await tradier.multilegOptionOrder(symbol, 'debit', legs, 0.20) // Buy for $20 or less per side
  } catch (e) {
    // TODO Log error
  }
}



export const buyIronCondor = async (symbol: string, shortDelta: number, targetStrikeWidth: number, put: boolean = true, call: boolean = true) => {
  try {
    if (!put && !call) {
      return
    }

    const expirations = await tradier.getExpirations(symbol, 100)
    if (!expirations || expirations.length === 0) {
      return
    }

    const expiration = expirations[0]

    if (!expiration) {
      return
    }

    const chain = await tradier.getOptionChain(symbol, expiration)

    if (put) {
      await buySpreadByPremium(chain, symbol, 'put', shortDelta, targetStrikeWidth)
    }
    if (call) {
      await buySpreadByPremium(chain, symbol, 'call', shortDelta, targetStrikeWidth)
    }
  } catch (e) {
    // TODO Log error
  }
}



export const buyIronCondors = async () => {
  // TODO Make these settings
  const buyICEnabled = true
  const targetDelta = 15
  const targetStrikeWidth = 1

  if (!buyICEnabled) {
    return
  }

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
  const longSpreads = openSpreads.filter(spread => spread.side === 'long')
  const openOptionSymbols = longSpreads.reduce((acc, spread) => [ ...acc, ...spread.positions.map(pos => pos.symbol) ], [])

  // Map out what symbols have open positions
  const openPositionTypes = symbols.map(symbol => ({
    symbol,
    hasCall: openOptionSymbols.some(openSymbol => getUnderlying(openSymbol) === symbol && getType(openSymbol) === 'call'),
    hasPut: openOptionSymbols.some(openSymbol => getUnderlying(openSymbol) === symbol && getType(openSymbol) === 'put'),
  }))


  for (let x = 0; x < openPositionTypes.length; x++) {
    const position = openPositionTypes[x]
    await buyIronCondor(position.symbol, targetDelta, targetStrikeWidth, !position.hasPut, !position.hasCall)
  }
}